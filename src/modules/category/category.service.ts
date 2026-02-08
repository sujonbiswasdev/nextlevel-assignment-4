import z, { success } from "zod"
import { Category } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { formatZodIssues } from "../../utils/handleZodError"

const CreateCategory = async (data: { name: string }, adminId: string) => {
  const categoryData = z.object({
    name: z.string()
  }).strict()
  const parseData = categoryData.safeParse(data)
  if (!parseData.success) {
    return {
      success: false,
      message: `your provided data is invalid`,
      data: formatZodIssues(parseData.error)
    }
  }
  await prisma.user.findUniqueOrThrow({ where: { id: adminId } })
  const result = await prisma.category.create({
    data: {
      name: data.name,
      adminId: adminId
    }
  })

    return {
    sucess:true,
    message:result?`your category has been created`:`your category didn't created`,
    result
  }

}


const getCategory = async () => {
  const result = await prisma.category.findMany({ include: { meals: true, user: true } })
  return {
    success: true,
    message: result ? `retrieve all category sucessfully` : `couldn't retrieve all category`,
    result
  }

}

const SingleCategory = async (id: string) => {
  const result = await prisma.category.findFirstOrThrow({
    where: { id },
    include: { meals: true, user: true }
  })
  return {
    sucess: true,
    message: result ? `retrieve single category sucessfully` : `retrieve single category fail`,
    result
  }

}

const UpdateCategory = async (id: string, data: Partial<Category>) => {
  const categoryData = z.object({
    name: z.string()
  }).strict()
  const parseData = categoryData.safeParse(data)
  if (!parseData.success) {
    return {
      success: false,
      message: `your provided data is invalid`,
      data: formatZodIssues(parseData.error)
    }
  }
  const { name } = data;
  const existcategory = await prisma.category.findUniqueOrThrow({ where: { id } })
  if (existcategory.name == name) {
    throw new Error("Category name is already up to date.")

  }
  const result = await prisma.category.update({
    where: {
      id
    },
    data: {
      name
    }
  })
  return {
    success:false,
    message:result?`your category has beed changed`:`your category didn't changed`,
    result}
}

const DeleteCategory = async (id: string) => {
  await prisma.category.findUniqueOrThrow({ where: { id } })
  const result = await prisma.category.delete({
    where: { id }
  })
  return {
    success:true,
    message:result?`your category data sucessfully`:`your category delete failed`,
    result}

}


export const categoryService = { CreateCategory, getCategory, UpdateCategory, DeleteCategory, SingleCategory }