const DataTypes = require('sequelize').DataTypes;
module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable("reviews", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_review: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    company_to_review: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    score: 
    {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    comment: 
    {
      type: Sequelize.STRING,
      allowNull: true,
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

  down: async (queryInterface) => queryInterface.dropTable("reviews"),
};