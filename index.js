import express from "express"
import prismaClient from "./database/PrismaClient.js";

const app = express();
app.use(express.json());
 
app.get("/users", async (request, response) => {
    try {
        const users = await prismaClient.user.findMany({
            orderBy: {
                name: "asc"
            },
            select: { id: true, name: true, email: true, phone: true }
        });
        return response.status(200).json(users);
    } catch(error) {
        return response.status(500).json({"error": error});
    }
})

app.post("/user", async (request, response) => {
    const { name, email, phone } = request.body;
    try {
        const user = await prismaClient.user.create({
            data: {  name,  email, phone },
            select: { id: true, name: true, email: true, phone: true }
        })
        return response.status(201).json(user);
    } catch(error) {
        return response.status(500).json({"error": error});
    }
})

app.put("/user/:id", async (request, response) => {
    const { name, email, phone } = request.body;
    const { id } = request.params;
    try {
        const userExist = await prismaClient.user.findUnique({ where: { id } })
    
        if (!userExist) {
            return response.status(404).json({error: "User not found"});
        }

        const user = await prismaClient.user.update({
            data: { name, email, phone },
            where: { id }
        })

        return response.status(200).json(user);
    } catch(error) {
        return response.status(500).json({"error": error});
    }
})


app.delete("/user/:id", async (request, response) => {
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
})

app.listen(3000, () => {
    console.log("Server runnning")
})