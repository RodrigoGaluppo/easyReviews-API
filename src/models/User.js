const Sequelize = require('sequelize')
const Model = Sequelize.Model
const DataTypes = Sequelize.DataTypes;
const bcrypt = require('bcryptjs')
const appConfig = require("../config/appConfig")

module.exports = class User extends Model {
  static init(sequelize) {
    super.init({
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
      },
      img_url:{
        type:Sequelize.VIRTUAL,
        get()
        {
          return `${appConfig.localUrl}/${this.getDataValue("profile_img")}`
        }
      }
    }, {
      sequelize,
      tableName:"users"
    })

    return this
  }

}
