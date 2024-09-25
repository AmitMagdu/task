const Productmodel = require('../models/ProductTransaction');

let getStatistics = async (req, res, returnData = false) => {
  const { month } = req.query;
  const query = {
      $expr: {
          $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
      }
  };

  const totalSaleAmount = await Productmodel.aggregate([
      { $match: { ...query, sold: true } },
      { $group: { _id: null, totalSaleAmount: { $sum: "$price" } } }
  ]);

  const totalSoldItems = await Productmodel.countDocuments({ ...query, sold: true });
  const totalNotSoldItems = await Productmodel.countDocuments({ ...query, sold: false });

  const result = {
      total_sale_amount: totalSaleAmount.length ? totalSaleAmount[0].totalSaleAmount : 0,
      total_sold_items: totalSoldItems,
      total_not_sold_items: totalNotSoldItems
  };

  if (returnData) {
      return result;
  } else {
      res.json(result);
  }
};

let getBarChartData = async (req, res, returnData = false) => {
  const { month } = req.query;
  const products = await Productmodel.find({
      $expr: {
          $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
      }
  });

  const chartData = [
      { priceRange: "0-100", count: 0 },
      { priceRange: "101-200", count: 0 },
      { priceRange: "201-300", count: 0 },
      { priceRange: "301-400", count: 0 },
      { priceRange: "401-500", count: 0 },
      { priceRange: "501-600", count: 0 },
      { priceRange: "601-700", count: 0 },
      { priceRange: "701-800", count: 0 },
      { priceRange: "801-900", count: 0 },
      { priceRange: "901-above", count: 0 }
  ];

  products.forEach(product => {
      const price = product.price;
      if (price <= 100) chartData[0].count++;
      else if (price <= 200) chartData[1].count++;
      else if (price <= 300) chartData[2].count++;
      else if (price <= 400) chartData[3].count++;
      else if (price <= 500) chartData[4].count++;
      else if (price <= 600) chartData[5].count++;
      else if (price <= 700) chartData[6].count++;
      else if (price <= 800) chartData[7].count++;
      else if (price <= 900) chartData[8].count++;
      else chartData[9].count++;
  });

  if (returnData) {
      return chartData;
  } else {
      res.json(chartData);
  }
};

let getPieChartData = async (req, res, returnData = false) => {
  const { month } = req.query;

  const products = await Productmodel.aggregate([
      {
          $match: {
              $expr: {
                  $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
              }
          }
      },
      {
          $group: {
              _id: "$category",
              count: { $sum: 1 }
          }
      }
  ]);

  const chartData = products.map(product => ({
      category: product._id,
      count: product.count
  }));

  if (returnData) {
      return chartData;
  } else {
      res.json(chartData);
  }
};





let getCombinedData = async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) {
            return res.status(400).json({ message: "Month is required" });
        }

        // Fetch data from all three APIs in parallel
        const [statisticsData, barChartData, pieChartData] = await Promise.all([
            getStatistics(req, res, true),  // Pass a flag to return the data instead of sending a response
            getBarChartData(req, res, true),
            getPieChartData(req, res, true)
        ]);

        // Combine all the responses into one JSON object
        const combinedResponse = {
            statistics: statisticsData,
            barChart: barChartData,
            pieChart: pieChartData
        };

        // Send the combined response
        res.json(combinedResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};




  module.exports={getStatistics,getBarChartData,getPieChartData,getCombinedData}









  // let combinechart=async(req,res)=>{
  //   try {
  //     const { month } = req.query;
  
  //     const [statistics, barChartData, pieChartData] = await Promise.all([
  //       axios.get(`/static?month=${month}`),
  //       axios.get(`/barchart?month=${month}`),
  //       axios.get(`/piechart?month=${month}`),
  //     ]);
  
  //     const combinedData = {
  //       statistics: statistics.data,
  //       barChartData: barChartData.data,
  //       pieChartData: pieChartData.data,
  //     };
  
  //     res.json(combinedData);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Error combining data' });
  //   }
  // }