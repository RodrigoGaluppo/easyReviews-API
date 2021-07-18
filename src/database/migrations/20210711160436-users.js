const DataTypes = require('sequelize').DataTypes;
module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('users', {
    
    id: 
    {
      type: Sequelize.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: 
    {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: 
    {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: 
    {
      type: Sequelize.STRING,
      allowNull: false,
    },

    profile_img: 
    {
      type: Sequelize.STRING,
      allowNull: true
    },

    created_at: 
    {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: 
    {
      type: Sequelize.DATE,
      allowNull: false,
    }

  }),

  down: async (queryInterface) => queryInterface.dropTable('users'),
};