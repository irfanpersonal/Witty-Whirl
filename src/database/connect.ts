import {Sequelize} from 'sequelize-typescript';

const sequelize = new Sequelize({
    database: 'witty_whirl',
    username: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_USER_PASSWORD,
    dialect: 'postgres',
    models: [__dirname + '/models'],
    logging: false
});

const syncTables = async() => {
    await sequelize.sync();
}

syncTables();

export default sequelize;