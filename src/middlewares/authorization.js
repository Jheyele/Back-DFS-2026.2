import jwt from "jsonwebtoken"

export default function(request, response, next){
    const { authorization } = request.headers;

    try {
        if(!authorization){
            return response.status(401).json("User unauthorized")
        }

        const { isAdmin } = jwt.verify(authorization, process.env.SECRET_JWT);

        if(!isAdmin){
            return response.status(403).json("User does not have permission")
        }

        return next();

    } catch (error) {
         return response.status(401).json(error)
    }
}