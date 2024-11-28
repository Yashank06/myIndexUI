import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import'./StockHeatMap.css';

const StockHeatMap = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stock data with current prices
  const fetchStockPrices = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/myIndex/myAllStocks");
      const stocksData = response.data;

      // Fetch stock prices
      const pricePromises = stocksData.map(stock =>
        axios
          .get(`http://localhost:8080/myIndex/stockPrice/${stock.stockSymbol}`)
          .then(response => ({ symbol: stock.stockSymbol, price: response.data.currPrice }))
          .catch(err => ({ symbol: stock.stockSymbol, price: null }))
      );

      const prices = await Promise.all(pricePromises);

      const updatedStocks = stocksData.map(stock => {
        const priceData = prices.find(p => p.symbol === stock.stockSymbol);
        return { ...stock, currentPrice: priceData ? priceData.price : null };
      });

      setStocks(updatedStocks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockPrices();
    const interval = setInterval(fetchStockPrices, 60000);
    return () => clearInterval(interval); // Clear interval when component unmounts
  }, [fetchStockPrices]);

  // Helper function to determine the background color based on price range
  const getBackgroundColor = (stock) => {
    if (!stock.currentPrice) return "white"; // If price is null

    const [buyLow, buyHigh] = stock.buyRange.split("-").map(Number);
    const [sellLow, sellHigh] = stock.sellRange.split("-").map(Number);

    if (stock.currentPrice >= buyLow && stock.currentPrice <= buyHigh) {
      return "red"; // Buy range
    } else if (stock.currentPrice >= sellLow && stock.currentPrice <= sellHigh) {
      return "green"; // Sell range
    } else {
      return "yellow"; // Neutral
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Stock Heatmap</h1>
      <div className="heatmap-container">
        {stocks.map((stock) => (
          <Link to={`/stocks/${stock.stockSymbol}`} key={stock.stockSymbol}>
            <div
              className="heatmap-box"
              style={{
                backgroundColor: getBackgroundColor(stock),
                padding: "20px",
                margin: "10px",
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <strong>{stock.stockSymbol}</strong>
              <div>Price: ₹{stock.currentPrice ? stock.currentPrice : "N/A"}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StockHeatMap;
