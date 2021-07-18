const Sequelize = require('sequelize')
const Model = Sequelize.Model
const DataTypes = Sequelize.DataTypes
const appConfig = require("../config/appConfig")

module.exports = class Company extends Model {
  static init(sequelize) {
    super.init({
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
      },
      img_url:
      {
        type:Sequelize.VIRTUAL,
        get(){
          return `${appConfig.localUrl}/${this.getDataValue("img_name")}`
        }
      }
    }, {
      sequelize,
      tableName:"companies"
    })

    return this

    
  }
  static associate(models){
      this.belongsTo(models.User,{foreignKey:"id"})
  }
}
