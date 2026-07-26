import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { generateToken } from "../utils/jwt";
import { logger } from "../logger/logger";
import { HttpError } from "../utils/http-error";


export async function registerUser(
    email:string,
    password:string,
    name?:string
){

    const existingUser = await prisma.user.findUnique({
        where:{
            email
        }
    });


    if(existingUser){
        throw new Error("Email already registered");
    }


    const hashedPassword = await bcrypt.hash(
        password,
        10
    );


    const user = await prisma.user.create({
        data:{
            email,
            password:hashedPassword,
            name
        }
    });


    const token = generateToken(user.id);

    logger.info(

        {

            userId: user.id,

            email: user.email

        },
    
        "User register"

    );


    return {
        user:{
            id:user.id,
            email:user.email,
            name:user.name
        },
        token
    };
}



export async function loginUser(
    email:string,
    password:string
){

    const user = await prisma.user.findUnique({
        where:{
            email
        }
    });


    if(!user){
        throw new HttpError(

    401,

    "Email atau password salah."

    );
    }


    const validPassword = await bcrypt.compare(
        password,
        user.password
    );


    if(!validPassword){
        throw new HttpError(

    401,

    "Email atau password salah."

    );
    }


    const token = generateToken(user.id);

    logger.info(

        {

             userId: user.id,

             email: user.email

        },

        "User login"

    );


    return {
        user:{
            id:user.id,
            email:user.email,
            name:user.name
        },
        token
    };

}