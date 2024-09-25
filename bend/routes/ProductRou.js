let express=require('express')
let {addproduct,getprod,listTransactions, getStatistics, getBarChartData}=require('../controllers/ProductCon')
let router=express.Router()

router.post('/add',addproduct)
router.get('/get',getprod)
router.get('/record',listTransactions)


module.exports=router