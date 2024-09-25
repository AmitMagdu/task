import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './App.css'


// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('3'); 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  
  const [perpage, setPerpage]=useState(10)

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/record`, {
        params: { month, search, page },
      });
      setTransactions(response.data.transactions);
      setTotalPages(response.data.total_pages);
      setPerpage(response.data.per_page)
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchCombinedData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/combined`, {
        params: { month },
      });
      setStatistics(response.data.statistics);
      setBarChartData(response.data.barChart);
      fetchTransactions(); 
    } catch (error) {
      console.error('Error fetching combined data:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCombinedData();
  }, [month, search, page]);

  
  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setPage(1); 
  };

  
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); 
  };

  // Handle next page
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Handle previous page
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Prepare bar chart data
  const barChartDataFormatted = {
    labels: barChartData.map((item) => item.priceRange), // Assuming barChartData contains price ranges
    datasets: [
      {
        label: 'Number of Items',
        data: barChartData.map((item) => item.count), // Assuming each item has count
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  let getmonth=(month)=>{
    const monthN=["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
    return monthN[month-1]
  }

  return (
    <div id='all'>
      <div className="transactions-page">
        <div id='center'>
      <h2 className="page-title">Transactions Dashboard</h2>
      </div>
      {/* Month Selector */}
      
      <select value={month} onChange={handleMonthChange} className="month-selector">
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>

      
      <input
        type="text"
        className="search-box"
        placeholder="Search transactions"
        value={search}
        onChange={handleSearchChange}
      />
      

     
      <div className="tablein">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>
                <img
                  src={transaction.image}
                  alt={transaction.title}
                  className="transaction-image"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

     
      <div className="pagination-buttons">
        <button onClick={handlePrevPage} disabled={page === 1} className="pagination-btn">
          Previous
        </button>
        <span className="pagination-info">
          Page No:{page} - PerPage:{perpage}
        </span>
        <button onClick={handleNextPage} disabled={page >= totalPages} className="pagination-btn">
          Next
        </button>
      </div>
    </div>

      


    <div className="statistics-container">
      <h3>Statistics - {getmonth(month)}</h3>
      <div className="stat-item">Total Amount of Sale: {statistics.total_sale_amount}</div>
      <div className="stat-item">Total Sold Items: {statistics.total_sold_items}</div>
      <div className="stat-item">Total Unsold Items: {statistics.total_not_sold_items}</div>
    </div>

    



    <div className="bar-chart-container">
      <h3>Transactions by Price Range (Bar Chart)</h3>
      <Bar data={barChartDataFormatted} />
    </div>

    </div>
  );
};

export default TransactionsPage;
