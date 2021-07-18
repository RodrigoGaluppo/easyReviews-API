const Sequelize = require('sequelize')
const Model = Sequelize.Model
const DataTypes = Sequelize.DataTypes;
const bcrypt = require('bcryptjs')

module.exports = class Review extends Model {
  static init(sequelize) {
    super.init({
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
  
    }, {
      sequelize,
      tableName:"reviews"
    })

    return this
  }

  static associate(models){
      this.belongsTo(models.User,{foreignKey:"id"})
      this.belongsTo(models.Company,{foreignKey:"id"})
  }

}
