import sessionSchema from "./sessionSchema.js";

// create 

export const createSession = (userObj) => {
    return sessionSchema(userObj).save();
}

export const deleteSession = (filter) =>{
    return sessionSchema.findOneAndDelete(filter)
}

//read @filter must be an object
export const getSession = (filter) => {
    return sessionSchema.findOne(filter);
};
