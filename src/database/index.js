const Sequelize = require("sequelize")
const databaseConfig = require('../config/database');
const User = require('../models/User');
const Review = require('../models/Review');
const Company = require('../models/Company');

const models = [User,Review,Company];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.init(connection));

models.forEach((model) => model.associate && model.associate(connection.models));
