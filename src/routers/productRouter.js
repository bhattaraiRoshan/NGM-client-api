import express from "express";
import { getProductByID, getProducts } from "../models/product/productModel.js";
import { buildErrorResponse, buildSuccessResponse } from "../utility/responseHelper.js";


const productRouter = express.Router();

// public route to get all product 

productRouter.get("/", async(req, res)=>{

    try {
        
        const products = await getProducts()
      
        const allProducts = [...products, products]
        

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
        console.log(_id);
        const product = await getProductByID(_id)
        console.log(product);
       return product?._id 
        ? buildSuccessResponse(res, product, "Product")
        : buildErrorResponse(res, "Something Went Worng, try again later")
    } catch (error) {
        buildErrorResponse(res, "Something Went Worng, try again later")
    }
})


export default productRouter