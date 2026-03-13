import { prisma } from "../../lib/prisma";
import { formatZodIssues } from "../../utils/handleZodError";
import { UpdatecategoryData } from "./category.validation";
import { ICreateCategory, IUpdateCategory } from "./category.interface";
import AppError from "../../errorHelper/AppError";
import status from "http-status";
const CreateCategory = async (data: ICreateCategory, adminId: string) => {
  const categorydata = await prisma.category.findUnique({
    where: {
      name: data.name,
    },
  });

  if (categorydata) {
    throw new AppError(409, "Category already exists");
  }

  await prisma.user.findUniqueOrThrow({
    where: { id: adminId },
  });

  const result = await prisma.category.create({
    data: {
      ...data,
      adminId: adminId,
    },
  });

  return result;
};

const getCategory = async () => {
  const result = await prisma.category.findMany({
    include: {
      meals: {
        where: {
          status: "APPROVED",
        },
      },
      user: true,
    },
    orderBy: { name: "desc" },
  });
  return result;
};

const SingleCategory = async (id: string) => {
  const result = await prisma.category.findFirstOrThrow({
    where: { id },
    include: {
      meals: {
        include: {
          reviews: true,
        },
      },
      user: true,
    },
  });
  return result;
};

const UpdateCategory = async (id: string, data: IUpdateCategory) => {
 
  const { name } = data;
  const existcategory = await prisma.category.findUniqueOrThrow({
    where: { id },
  });
  if (existcategory.name == name) {
    throw new AppError(409,"Category name is already up to date.");
  }
  const result = await prisma.category.update({
    where: {
      id,
    },
    data: {
      ...data
    },
  });
  return result;
};

const DeleteCategory = async (id: string) => {
  await prisma.category.findUniqueOrThrow({ where: { id } });
  const result = await prisma.category.delete({
    where: { id },
  });
  return result;
};

export const categoryService = {
  CreateCategory,
  getCategory,
  UpdateCategory,
  DeleteCategory,
  SingleCategory,
};
