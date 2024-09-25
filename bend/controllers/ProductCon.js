const axios = require('axios');
const Productmodel = require('../models/ProductTransaction');

const addproduct = async () => {
    try {
        const r = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transaction = r.data;

        await Productmodel.insertMany(transaction);
        console.log('Data stored in database');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

// let addproduct=async(req,res)=>{
//     let data={...req.body}
//     await new Productmodel(data).save().then(()=>{
//     res.json({"msg":"prod added"})
//    }).catch((err)=>{
//     res.json({"err":"error in adding prod"})

//    })
//   }

  let getprod=async(req,res)=>{
    try
    {
    let data=await Productmodel.find()
    res.json(data)
    }
    catch(err)
    {
      console.log(err)
    }


  }




let listTransactions = async (req, res) => {
  try {
    const { search, page, per_page, month } = req.query;
    const pageNumber = parseInt(page) || 1;
    const perPage = parseInt(per_page) || 10;

    // Validate month input
    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    // Build query for search
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];

      // Ensure price is not matched via regex, use exact number match for price
      const searchAsNumber = parseFloat(search);
      if (!isNaN(searchAsNumber)) {
        query.$or.push({ price: searchAsNumber });
      }
    }

    // Add month filter to the query
    query.$expr = {
      $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
    };

    // Get filtered transactions with pagination
    const transactions = await Productmodel.find(query)
      .skip((pageNumber - 1) * perPage) 
      .limit(perPage); 

    // Get total number of records
    const totalRecords = await Productmodel.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / perPage);

    res.json({
      transactions,       
      total_pages: totalPages,  
      total_records: totalRecords, 
      current_page: pageNumber,  
      per_page: perPage          
      
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports={addproduct,getprod,listTransactions}
