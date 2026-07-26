import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";


export function getProfile(
    req:AuthRequest,
    res:Response
){

    res.json({
        success:true,
        data:req.user
    });

}