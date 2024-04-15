import {Request, Response, NextFunction} from 'express';
import {verifyToken, ITokenPayload} from '../utils';
import CustomError from '../errors';

interface IRequest extends Request {
    user?: ITokenPayload
}

const authentication = (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.signedCookies.token;
        if (!token) {
            throw new CustomError.UnauthorizedError('Missing Token');
        }
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch(error) {
        throw new CustomError.UnauthorizedError('Failed to Authenticate User');
    }
}

export {
    authentication
};