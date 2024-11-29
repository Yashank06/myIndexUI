import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "https://myindex-production.up.railway.app";

const StockInfoPage = () => {
  const { symbol } = useParams(); // Extract symbol from URL
  const [stockInfo, setStockInfo] = useState(null);
  const [stockPrice, setStockPrice] = useState(null);
  const [error, setError] = useState('');
  const [bgColor, setBgColor] = useState('yellow'); // Default background color

  // Helper function to check range
  const isInRange = (price, range) => {
    const [low, high] = range.split('-').map(Number);
    return price >= low && price <= high;
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setError('');
        // Fetch stock information once
        const stockInfoResponse = await axios.get(`${API_BASE_URL}/myIndex/myStock/${symbol}`);
        console.log('Fetched stock info:', stockInfoResponse.data); // Debugging stock info API
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
        const price = stockPriceResponse.data.currPrice;
        setStockPrice(price);

        // Update background color based on price range
        if (stockInfo) {
          if (isInRange(price, stockInfo.buyRange)) {
            setBgColor('green'); // Buy range
          } else if (isInRange(price, stockInfo.sellRange)) {
            setBgColor('red'); // Sell range
          } else {
            setBgColor('yellow'); // Default
          }
        }
      } catch (err) {
        console.error('Error fetching stock price:', err);
      }
    };

    // Fetch the price immediately and then every 2 seconds
    fetchStockPrice();
    const interval = setInterval(fetchStockPrice, 500000);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [symbol, stockInfo]);

  return (
    <div style={{ backgroundColor: bgColor, padding: '20px', minHeight: '100vh' }}>
      <h1>Stock Information</h1>
      <h2>Symbol: {symbol}</h2>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Stock Info Display */}
      {stockInfo && (
        <div>
          <h2>Stock Details</h2>
          <p><strong>Name:</strong> {stockInfo.stockName}</p>
          <p><strong>Industry:</strong> {stockInfo.industryType}</p>
          <p><strong>Market Cap:</strong> {stockInfo.mktCap}</p>
          <p><strong>Sell Range:</strong> {stockInfo.sellRange}</p>
          <p><strong>Buy Range:</strong> {stockInfo.buyRange}</p>
          <p><strong>Yearly Rating:</strong> {stockInfo.yearlyRating}</p>
          <p><strong>Quarterly Rating:</strong> {stockInfo.qtrRating}</p>
        </div>
      )}

      {/* Stock Price Display */}
      <div>
        <h2>Current Stock Price</h2>
        <p><strong>Price:</strong> ₹{stockPrice !== null ? stockPrice : 'Loading...'}</p>
      </div>
    </div>
  );
};

export default StockInfoPage;
