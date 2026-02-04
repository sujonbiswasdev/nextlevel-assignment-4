import { prisma } from "../../lib/prisma"

const CreateReviews=async(customerid:string,mealid:string,data:{rating:string,comment:string,parentId?:string},role:string)=>{
    if(role!=='Customer'){
        throw new Error("Reviews create only Customer")
    }

  return  await prisma.review.create({
    data:{
        customerId:customerid,
        mealId:mealid,
        rating:data.rating,
        comment:data.comment,
        parentId:data.parentId
    }
    })

}

export const ReviewsService={CreateReviews}