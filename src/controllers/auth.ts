import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import User, {IUser} from '../database/models/User';
import {createToken, createCookieWithToken} from '../utils/index';
import CustomError from '../errors';

interface AuthRequest extends Request {
    body: IUser
}

const register = async(req: AuthRequest, res: Response) => {
    const user = await User.create(req.body);
    const token = createToken(user);
    createCookieWithToken(res, token);
    return res.status(StatusCodes.CREATED).json({user});
}

const login = async(req: AuthRequest, res: Response) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password!');
    }
    const user = await User.findOne({
        where: {
            email: email
        }
    });
    if (!user) {
        throw new CustomError.NotFoundError('No User Found with the Email Provided!');
    }
    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
        throw new CustomError.BadRequestError('Incorrect Password!');
    }
    const token = createToken(user);
    createCookieWithToken(res, token);
    return res.status(StatusCodes.OK).json({user});
}

const logout = async(req: AuthRequest, res: Response) => {
    res.clearCookie('token');
    return res.status(StatusCodes.OK).json({msg: 'Successfully Logged Out!'});
}

export {
    register,
    login,
    logout
};