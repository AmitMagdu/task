let express=require('express')
let {getBarChartData,getStatistics,getPieChartData,getCombinedData}=require('../controllers/staticschart')
let router=express.Router()


router.get('/static',getStatistics)
router.get('/barchart',getBarChartData)
router.get('/piechart',getPieChartData)
router.get('/combined', getCombinedData);

module.exports=router