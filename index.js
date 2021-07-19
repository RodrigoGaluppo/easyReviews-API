require('./src/database')
const {resolve} = require("path")
const express = require("express")
const app = express()
const router = require("./src/routes/router")
const bodyparser = require("body-parser")
const cors = require("cors")
const {Sequelize} = require("sequelize")

require("dotenv/config")

app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use(cors())
app.use(express.static(resolve(__dirname,"uploads")))


app.use("/",router)

app.listen(process.env.PORT || 3333,(req,res)=>{
    console.log('working')
})
