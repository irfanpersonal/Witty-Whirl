import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import User, {IUser} from '../database/models/User';
import {ITokenPayload, deleteImage} from '../utils';
import CustomError from '../errors';
import Sequelize from 'sequelize';
import {UploadedFile} from 'express-fileupload';
import path from 'node:path';
import {v2 as cloudinary} from 'cloudinary';

interface UserRequest extends Request {
    params: {
        id: string
    },
    body: IUser & {
        oldPassword: string,
        newPassword: string
    },
    query: {
        search: string,
        country: string,
        hobbies: string,
        sort: 'latest' | 'oldest',
        page: string,
        limit: string
    }
    user?: ITokenPayload
}

const showCurrentUser = async(req: UserRequest, res: Response) => {
    const user = await User.findByPk(req.user!.userID, {
        attributes: {exclude: ['password']}
    });
    return res.status(StatusCodes.OK).json({user});
}

const getAllUsers = async(req: UserRequest, res: Response) => {
    const {search, country, hobbies, sort} = req.query;
    const queryObject: {[index: string]: any, [index: symbol]: any} = {};
    if (search) {
        queryObject.name = {[Sequelize.Op.like]: `%${search}%`};
    }
    if (country) {
        queryObject.country = {[Sequelize.Op.like]: `%${country}%`};
    }
    if (hobbies) {
        queryObject.hobbies = {[Sequelize.Op.contains]: hobbies};
    }  
    let order: Sequelize.OrderItem[] | undefined;
    if (sort === 'oldest') {
        order = [['createdAt', 'ASC']]; 
    } else if (sort === 'latest') {
        order = [['createdAt', 'DESC']];
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let result = User.findAll({
        where: queryObject,
        offset: skip,
        limit: limit,
        order: order,
        attributes: ['id', 'name', 'profilePicture', 'country', 'hobbies']
    });
    const users = await result;
    const totalUsers = (await User.findAll({where: queryObject})).length;
    const numberOfPages = Math.ceil(totalUsers / limit);
    return res.status(StatusCodes.OK).json({users, totalUsers, numberOfPages});
}

const getSingleUser = async(req: UserRequest, res: Response) => {
    const {id} = req.params;
    const user = await User.findByPk(id, {
        attributes: {exclude: ['password']}
    });
    if (!user) {
        throw new CustomError.NotFoundError('No User Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({user});
}

const updateUser = async(req: UserRequest, res: Response) => {
    const {name, email, bio, country, hobbies} = req.body;
    if (name || email || bio || country || hobbies) {
        (req.body.password as any) = undefined;
        (req.body.profilePicture as any) = undefined;
        // User returns an array of 1 element. We are destructuring that one
        // element. 
        const [numberOfUpdatedAttributes, [user]] = await User.update(
            {...req.body},
            {
                where: {
                    id: req.user!.userID
                },
                // Because we are using PostgreSQL we have the ability to use the 
                // returning property. So instead of getting back data like this
                // "user": [0], or "user": [1], where the number inside is the 
                // amount of updates that happened to the user object. We can set 
                // returning to true and the second element in the array will be 
                // the udpated user object. Which is awesome.
                returning: true
            }
        );
        // I know for a fact that the result will have a single user in the array. As
        // we have the unique property set meaning no duplicates for name.
        // Check if Profile Picture Provided
        if (req.files?.profilePicture) {
            const profilePicture = req.files.profilePicture as UploadedFile;
            const maxSize = 1000000 * 2;
            if (!profilePicture.mimetype.startsWith('image') || profilePicture.size > maxSize) {
                throw new CustomError.BadRequestError('Invalid Profile Picture submission!');
            }
            if (user.profilePicture) {
                const oldImage = user.profilePicture.substring(user.profilePicture.indexOf('WITTY'));
                await cloudinary.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
            }
            const uniqueIdentifierForProfilePicture = new Date().getTime() + '_' + 'profile_picture' + '_' + profilePicture.name;
            const destinationForProfilePicture = path.resolve(__dirname, '../images', uniqueIdentifierForProfilePicture);
            await profilePicture.mv(destinationForProfilePicture);
            const resultForProfilePicture = await cloudinary.uploader.upload(destinationForProfilePicture, {
                public_id: uniqueIdentifierForProfilePicture, 
                folder: 'WITTY-WHIRL/PROFILE_PICTURES'
            });
            await deleteImage(destinationForProfilePicture);
            user.profilePicture = resultForProfilePicture.secure_url;
            await user.save();
        }
        const updatedUser = {...user.toJSON()};
        delete (updatedUser as any).password;
        return res.status(StatusCodes.OK).json({user: updatedUser});
    }
    else {
        throw new CustomError.BadRequestError('You need to provide atleast 1 thing to update!');
    }
}

const updateUserPassword = async(req: UserRequest, res: Response) => {
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide oldPassword and newPassword!');
    }
    const user = (await User.findByPk(req.user!.userID))!;
    const isCorrect = await user.comparePassword(oldPassword);
    if (!isCorrect) {
        throw new CustomError.BadRequestError('Incorrect Old Password!');
    }
    user.password = newPassword;
    await user.save();
    const updatedUser = {...user.toJSON()};
    delete (updatedUser as any).password;
    return res.status(StatusCodes.OK).json({user: updatedUser});
}

export {
    showCurrentUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserPassword
};