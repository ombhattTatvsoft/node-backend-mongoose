import { verifyAccesToken } from "../utils/jwt.util.js";

export const authenticate = (req,res,next) => {
    try {
        const {accessToken} = req.cookies;
        if(!accessToken) throw new Error('Unauthorized');
        req.user = verifyAccesToken(accessToken);
        next();
    } catch (error) {
        return res.status(401).json({message: 'Unauthorized'});
    }
}