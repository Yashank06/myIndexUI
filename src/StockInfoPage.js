import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell } from 'recharts';
import './StockInfoPage.css'; // Import the CSS file

const API_BASE_URL = "https://myindex-production.up.railway.app";

const StockInfoPage = () => {
  const { symbol } = useParams(); // Extract symbol from URL
  const [stockInfo, setStockInfo] = useState(null);
  const [stockPrice, setStockPrice] = useState(null);
  const [error, setError] = useState('');

  // Helper function to check range
  const isInRange = (price, range) => {
    if (!range) return false;
    const [low, high] = range.split('-').map(Number);
    return price >= low && price <= high;
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setError('');
        // Fetch stock information once
        const stockInfoResponse = await axios.get(`${API_BASE_URL}/myIndex/myStock/${symbol}`);
        setStockInfo(stockInfoResponse.data);
      } catch (err) {
        setError('Error fetching stock data. Please check the symbol and try again.');
        console.error(err);
      }
    };

    fetchStockData();
  }, [symbol]);

  useEffect(() => {
    const fetchStockPrice = async () => {
      try {
        // Fetch the stock price
        const stockPriceResponse = await axios.get(`${API_BASE_URL}/myIndex/stockPrice/${symbol}`);
        setStockPrice(stockPriceResponse.data.currPrice);
      } catch (err) {
        console.error('Error fetching stock price:', err);
      }
    };

    // Fetch the price immediately and then every 5 seconds
    fetchStockPrice();
    const interval = setInterval(fetchStockPrice, 5000);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [symbol]);

  // Determine pie chart colors dynamically
  const getPieColors = () => {
    if (!stockInfo || stockPrice === null) return ["#FFB700", "#FFB700"]; // Default Yellow
    if (isInRange(stockPrice, stockInfo.buyRange)) return ["#4CAF50", "#f5f5f5"]; // Green for buy range
    if (isInRange(stockPrice, stockInfo.sellRange)) return ["#F44336", "#f5f5f5"]; // Red for sell range
    return ["#FFB700", "#FFB700"]; // Default Yellow
  };

  const pieData = stockInfo ? [
    { value: stockInfo.yearlyRating || 0 },
    { value: 100 - (stockInfo.yearlyRating || 0) }
  ] : [];

  return (
    <div className="container">
      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Stock Performance Chart */}
      <div className="pie-container">
        <PieChart width={200} height={200}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getPieColors()[index]} />
            ))}
          </Pie>
        </PieChart>
        {stockInfo && (
          <div className="chart-text">
            <strong>{symbol}</strong>
            <br />
            ₹{stockPrice !== null ? stockPrice : 'Loading...'}
          </div>
        )}
      </div>

      {/* Stock Info Display */}
      {stockInfo && (
        <div className="info-cards-container">
          <div className="card">
            <p>Industry</p>
            <h4>{stockInfo.industryType}</h4>
          </div>
          <div className="card">
            <p>Market Cap</p>
            <h4>{stockInfo.mktCap}</h4>
          </div>
          <div className="card">
            <p>Sell Range</p>
            <h4>{stockInfo.sellRange}</h4>
          </div>
          <div className="card">
            <p>Buy Range</p>
            <h4>{stockInfo.buyRange}</h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockInfoPage;
