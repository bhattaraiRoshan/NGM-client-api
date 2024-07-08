import productSchema from "./productSchema.js";


// get all product 

export const getProducts = () =>{
    return productSchema.find()
}


// get one product by ID 

export const getProductByID = (_id) =>{
    return productSchema.findById(_id)
}