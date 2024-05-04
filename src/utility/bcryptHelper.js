import bcrypt from "bcrypt"

const Salt = 15

export const hashPassword = (pPassword) =>{
    return bcrypt.hashSync(pPassword, Salt)
}


export const comparePassword = (plainPassword, hassedPassword) =>{
    return bcrypt.compareSync(plainPassword, hassedPassword)
}