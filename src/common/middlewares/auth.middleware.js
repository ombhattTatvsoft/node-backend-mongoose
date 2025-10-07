import { verifyAccesToken } from "../utils/jwt.util.js";
import * as userService from "../../modules/user/user.service.js";

export const authenticate = async (req,res,next) => {
    try {
        const {accessToken} = req.cookies;
        if(!accessToken) throw new Error();
        const user = verifyAccesToken(accessToken);
        if(await userService.getUserById(user._id))
            req.user = user;
        // req.user = await userService.getUserByEmail(user.email);
        next();
    } catch (error) {
        return res.status(401).json({message: 'Unauthorized'});
    }
}