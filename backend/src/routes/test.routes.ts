import { Router } from "express";
import prisma from "../config/prisma";


const router = Router();


router.get("/users", async (req, res) => {

  const users = await prisma.user.findMany();

  res.json({
    success: true,
    data: users
  });

});


export default router;