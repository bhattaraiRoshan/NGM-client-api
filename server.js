import "dotenv/config"
import express from "express";
import cors from "cors";
import { connectToMongoDb } from "./src/db/dbConfig.js";
const PORT = process.env.PORT || 8000;


const app = express();

app.use(cors())
app.use(express.json())

// connect to database
connectToMongoDb()

app.listen(PORT, (error)=>{
    error ? console.log(error) : console.log("Server is runing")
})