import { verifyAccesToken } from "../utils/jwt.util.js";
import * as userService from "../../modules/user/user.service.js";

export const authenticate = async (req,res,next) => {
    try {
        const {accessToken} = req.cookies;
        if(!accessToken) throw Error;
        const user = verifyAccesToken(accessToken);
        const userData = await userService.getUserById(user._id);
        if(userData)
            req.user = userData;
        else
            throw Error;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Unauthorized'});
    }
}