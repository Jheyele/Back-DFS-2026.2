import jwt from "jsonwebtoken"

export default function(request, response, next){
    const { authorization } = request.headers;

    try {
        if(!authorization){
            return response.status(401).json("User unauthorized")
        }

        const { id } = jwt.verify(authorization, process.env.SECRET_JWT);

        if(!id){
            return response.status(401).json("Token invalid")
        }

        return next();

    } catch (error) {
         return response.status(401).json(error)
    }
}