import User from '../database/models/User';
import Sequelize from 'sequelize';

export type GetAllUsersQueryType = {
    search: string,
    country: string,
    hobbies: string[],
    sort: string,
    page: string,
    limit: string
};

const getAllUsers = async(connection: WebSocket, queryData: GetAllUsersQueryType) => {
    const {search, country, hobbies, sort} = queryData;
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
    const page = Number(queryData.page) || 1;
    const limit = Number(queryData.limit) || 10;
    const skip = (page - 1) * limit;
    let result = User.findAll({
        where: queryObject,
        offset: skip,
        limit: limit,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'name', 'profilePicture', 'country', 'hobbies']
    });
    const users = await result;
    const totalUsers = (await User.findAll({where: queryObject})).length;
    const numberOfPages = Math.ceil(totalUsers / limit);
    return ({users, totalUsers, numberOfPages});
}

export {
    getAllUsers
};