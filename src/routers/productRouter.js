import express from "express";
import { getProductByID, getProducts } from "../models/product/productModel.js";
import { buildErrorResponse, buildSuccessResponse } from "../utility/responseHelper.js";


const productRouter = express.Router();

// public route to get all product 

productRouter.get("/", async(req, res)=>{

    try {
        
        const products = await getProducts()
      
        console.log(products);
        

       return products?.length 
        ? buildSuccessResponse(res, products, "Products")
        : buildErrorResponse("")
    } catch (error) {

        buildErrorResponse(res, "Could not find the product")
        
    }

})

// get the book from ID 

productRouter.get("/:_id", async(req,res)=>{

    try {
        const {_id} = req.params
        const product = await getProductByID(_id)

      
       
       return product?._id 
        ? buildSuccessResponse(res, product, "Product")
        : buildErrorResponse(res, "Something Went Worng, try again later")
    } catch (error) {
        buildErrorResponse(res, "Something Went Worng, try again later")
    }
})


export default productRouter