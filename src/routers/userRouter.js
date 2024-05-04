import express from "express"
import {v4 as uuidv4} from "uuid"
import { newUserValidation } from "../middlewares/validationMiddlewars/userValidation.js"
import { comparePassword, hashPassword } from "../utility/bcryptHelper.js";
import { createUser, findUserByEmail, updateUser } from "../models/user/userModels.js";
import { createSession, deleteSession } from "../models/session/sessionModel.js";
import { sendAccountVerifiedEmail, sendVerificationLinkEmail } from "../utility/nodemailerHelper.js";
import { buildErrorResponse, buildSuccessResponse } from "../utility/responseHelper.js";
import { generateJWTs } from "../utility/jwtHelper.js";
import { adminAuth, refreshAuth } from "../middlewares/authMiddlewares/authMiddlewares.js";


const userRouter = express.Router()

// public router 

// creat a user

userRouter.post("/", newUserValidation, async(req,res)=>{

    try {
        const {password} = req.body;
        const encryptedPassword = hashPassword(password)

        const user = await createUser({
            ...req.body,
            password: encryptedPassword
        })

        // once user is created sent the email to user 

        if(user?._id){

            // generate random user ID
            const randomID = uuidv4()

            // we store this random id in session table agains user email 
            const session = await createSession({token: randomID, userEmail: user.email})

            if(session._id){
                const verificationUrl = `${process.env.CLIENT_ROOT_URL}/verify-email?e=${user.email}&id=${randomID}`

                sendVerificationLinkEmail(user, verificationUrl)
            }
        }

        return user?._id
        ? buildSuccessResponse(res, {}, "Check your inbox/spam to verify your account")
        : buildErrorResponse(res, "Count not register your account")


    } catch (error) {

        if(error.code === 11000){
            error.message = "User with this email already exists!!"
          }
      
          buildErrorResponse(res, error.message)
        
        
    }
})

// verify-email 

userRouter.post("/verify-email", async(req,res)=>{
    try {
        const {userEmail, token} = req.body

        if(userEmail && token){
            const result = await deleteSession({token, userEmail})

            console.log(result._id);

            if(result?._id){
                // update user to set is Verified true

                const user = await updateUser({email: userEmail}, {isVerified: true})

                if(user?._id){

                    // send account verified and welcome email 

                    sendAccountVerifiedEmail(user, `${process.env.CLIENT_ROOT_URL}/login`)

                    return buildSuccessResponse(res, {}, "Your email is Verified. You may login in now")

                }
            }
            
        }

        return buildErrorResponse(res, "Account cannot be verified")
    } catch (error) {
        return console.log(error);
    }
})


// user login 

userRouter.post("/login", async(req,res)=>{

    try {
        const {email, password} = req.body;

        const user = await findUserByEmail(email)

        if(!user?._id){
            return buildErrorResponse(res, "User account does not exist!")
        }
        if(!user?.isVerified){
            return buildErrorResponse(res, "Account is not verified")
        }

        // password compare

        const isPasswordMatch = comparePassword(password, user.password)

        if(isPasswordMatch){
            const jwt = await generateJWTs(user.email)

            return buildSuccessResponse(res, jwt, "Logged in Successfully")
        }

        return buildErrorResponse(res, "Invalid Credentials")
    } catch (error) {

        console.log(error);
        
    }
})


// get user

userRouter.get("/", adminAuth, async(req,res)=>{
    try {
        return buildSuccessResponse(res, req.userInfo, "User Info")
    } catch (error) {
        return buildErrorResponse(res, error.message)
    }
})


// get accessJwt 

userRouter.get("/accessjwt", refreshAuth  )


export default userRouter