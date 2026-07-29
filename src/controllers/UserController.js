import prismaClient from "../database/PrismaClient.js";
import bcrypt from "bcryptjs";

export class UserController{

    async findUsers(request, response) {
        try {

            const users = await prismaClient.user.findMany({
                orderBy: {
                    name: "asc"
                },
                select: { id: true, name: true, email: true, phone: true, isAdmin: true }
            });
            return response.status(200).json(users);
        } catch(error) {
            return response.status(500).json({"error": error});
        }
    }

    async saveUser(request, response) {
        const { name, email, phone, password, isAdmin } = request.body;
        try {

            const hashPass = bcrypt.hashSync(password, 10);

            const user = await prismaClient.user.create({
                data: {  name,  email, phone, password: hashPass, isAdmin },
                select: { id: true, name: true, email: true, phone: true, isAdmin: true }
            })
            return response.status(201).json(user);
        } catch(error) {
            return response.status(500).json({"error": error});
        }
    }

     async updateUser(request, response) {
        const { name, email, phone, isAdmin, password } = request.body;
        const { id } = request.params;
        try {

            const passHash = bcrypt.hashSync(password, 10);

            const user = await prismaClient.user.findUnique({ where: { id } });

            if(!user) {
                return response.status(404).json("User not found");
            }

            const userUpdated = await prismaClient.user.update({
                data: { name, email, phone, isAdmin, password: passHash },
                where: { id },
                select: { id: true, name: true, email: true, isAdmin: true, phone: true }
            })

            return response.status(200).json(userUpdated);
        } catch(error) {
            return response.status(500).send();
        }
    }

    async deleteUser(request, response) {
        const { id } = request.params;
        try {
            const userExist = await prismaClient.user.findUnique({ where: { id } })
        
            if (!userExist) {
                return response.status(404).json({error: "User not found"});
            }

            const user = await prismaClient.user.delete({ where: { id }});

            return response.status(204).send();
        } catch(error) {
            return response.status(500).json({"error": error});
        }
    }

    async findUserById (request, response) {
        const { id } = request.params

        try{
            const user = await prismaClient.user.findFirst({
                select: {
                    id: true, name: true, email: true, phone: true, isAdmin: true
                },
                where: { id }
            });
            return response.status(200).json(user);
        } catch(error){
            return response.status(500).json(error);
        }
    }
}