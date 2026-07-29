import prismaClient from "../database/PrismaClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export class LoginController{

    async sign(request, response) {
        const { email, password } = request.body;

        try {
            
            const userExist = await prismaClient.user.findUnique({ where: { email } });

            if(!userExist){
                return response.status(401).json("User unauthorized")
            }

            const isValid = bcrypt.compareSync(password, userExist.password);

            if(!isValid){
                return response.status(401).json("User unauthorized")
            }

            const payload = { id: userExist.id, name: userExist.name, isAdmin: userExist.isAdmin };

            const token = jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: '4h' })
            
            return response.status(200).json({...payload, token});

        } catch (error) {
            return response.status(500).json(error);
        }
    }
}