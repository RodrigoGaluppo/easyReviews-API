const DataTypes = require('sequelize').DataTypes;
module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('companies', {
    
    id: 
    {
      type: Sequelize.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    name: 
    {
      type: Sequelize.STRING,
      allowNull: false,
    },
    country:
    {
      type: Sequelize.STRING,
      allowNull: true,
    },
    city: 
    {
      type: Sequelize.STRING,
      allowNull: true,
    },
    img_name: 
    {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: 
    {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    site_url:{
      type:Sequelize.STRING,
      allowNull:false
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

  down: async (queryInterface) => queryInterface.dropTable('companies'),
};