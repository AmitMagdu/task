let express=require("express")
let mongoose=require('mongoose')
let cors=require('cors')
let productroute=require('./routes/ProductRou')
let staticschart=require('./routes/staticroute')
let app=express()

app.use(express.json())
app.use(cors())
mongoose.connect("mongodb://localhost:27017/prod").then(()=>{
    console.log("ok")
}).catch((err)=>{
    console.log(err)
})
app.use("/",productroute)
app.use('/',staticschart)


app.listen(5000)