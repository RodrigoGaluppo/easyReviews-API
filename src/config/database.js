require("dotenv").config()

module.exports = {
    dialect: "postgres",
    host:process.env.DATABASE_HOST,
    port:process.env.DATABASE_PORT,
    username:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_DB,
    
    define:{
        timestamps:true,
        underscored:true,
        underscoredAll:true,
        "createdAt":"created_at",
        "updatedAt":"updated_at"
    },
    dialectOptions:{
        timezone:"Europe/Lisbon",
        ssl: //false
        {
            rejectUnauthorized: false
        }
    },
    timezone:"Europe/Lisbon"

}