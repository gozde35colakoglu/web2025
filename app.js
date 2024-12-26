const express=require("express")
const bodyParser=require("body-parser")
const path=require("path")
require('dotenv/config')
const router=require("./routers")
const app=express()
const port=process.env.PORT
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json())
app.use(express.json({limit:"50mb",extended:true,parameterLimit:50000}))
app.use("/api",router)
app.listen(port,()=>{
    console.log(`Sunucu ${port} portunda çalışmaktadır`)
})