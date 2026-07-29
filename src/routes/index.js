
import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { LoginController } from "../controllers/LoginController.js";
import authenticate from "../middlewares/authenticate.js";
import authorization from "../middlewares/authorization.js";


const userController = new UserController();
const loginController = new LoginController();

const router = Router();

router.get("/v1/users", userController.findUsers)
router.get("/v1/user/:id", userController.findUserById)  
router.post("/v1/user", userController.saveUser)
router.put("/v1/user/:id", userController.updateUser)
router.delete("/v1/user/:id", userController.deleteUser)

router.post("/v1/login", loginController.sign)

export default router