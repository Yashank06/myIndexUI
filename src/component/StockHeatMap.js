import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../StockHeatMap.css";

const API_BASE_URL = "https://myindex-production.up.railway.app";

const StockHeatMap = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stock data with current prices
  const fetchStockPrices = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/myIndex/myAllStocks`);
      const stocksData = response.data;

      // Fetch stock prices
      const pricePromises = stocksData.map((stock) =>
        axios
          .get(`${API_BASE_URL}/myIndex/stockPrice/${stock.stockSymbol}`)
          .then((response) => ({
            symbol: stock.stockSymbol,
            price: response.data.currPrice,
          }))
          .catch((err) => ({ symbol: stock.stockSymbol, price: null }))
      );

      const prices = await Promise.all(pricePromises);

      const updatedStocks = stocksData.map((stock) => {
        const priceData = prices.find((p) => p.symbol === stock.stockSymbol);
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
    const interval = setInterval(fetchStockPrices, 600000);
    return () => clearInterval(interval); // Clear interval when component unmounts
  }, [fetchStockPrices]);

  // Helper function to determine the background color based on price range
  const getBackgroundColor = (stock) => {
    if (!stock.currentPrice) return "white"; // If price is null

    const [buyLow, buyHigh] = stock.buyRange.split("-").map(Number);
    const [sellLow, sellHigh] = stock.sellRange.split("-").map(Number);

    if (stock.currentPrice >= buyLow && stock.currentPrice <= buyHigh) {
      return "#4CAF50"; // Buy range
    } else if (
      stock.currentPrice >= sellLow &&
      stock.currentPrice <= sellHigh
    ) {
      return "#F44336"; // Sell range
    } else {
      return "#FFB700"; // Neutral
    }
  };

  if (loading) {
    return <div className="div-center">Loading...</div>;
  }

  return (
    <div className="heatmap-root">
      <div class="indicator-container">
        <div class="indicator-box buy"></div>
        <span>BUY</span>
        <div class="indicator-box hold"></div>
        <span>HOLD</span>
        <div class="indicator-box sell"></div>
        <span>SELL</span>
      </div>

      <div className="heatmap">
        <div className="heatmap-container">
          {stocks.length > 0 ? (
            stocks.map((stock) => (
              <Link
                to={`/stocks/${stock.stockSymbol}`}
                key={stock.stockSymbol}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="heatmap-box"
                  style={{
                    backgroundColor: getBackgroundColor(stock),
                    padding: "20px",
                    margin: "2px 6px",
                    borderRadius: "8px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <div className="price-range sell-range">
                    {stock.sellRange
                      ? `${stock.sellRange}`
                      : ""}
                  </div>
                  <strong>{stock.stockSymbol}</strong>
                  <div>₹{stock.currentPrice ? stock.currentPrice : "N/A"}</div>
                  <div className="price-range buy-range">
                    {stock.buyRange ? `${stock.buyRange}` : ""}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No stocks available in your portfolio at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockHeatMap;
