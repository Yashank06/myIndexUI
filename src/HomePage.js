import React, { useState } from "react";
import axios from "axios";
import "./HomePage.css";

const API_BASE_URL = "https://myindex-production.up.railway.app";

const HomePage = () => {
  const [formData, setFormData] = useState({
    stockName: "",
    stockSymbol: "",
    industryType: "",
    mktCap: "",
    sellRange: "",
    buyRange: "",
    yearlyRating: "",
    qtrRating: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/myIndex/myStock`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setResponseMessage("Stock successfully registered!");
      console.log("Response:", response.data);
    } catch (error) {
      setResponseMessage("Error registering stock. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="stock-analysis-container">
      <div className="background-images">
        {/* You can add your chart and bar images here as background */}
      </div>
      <header>
        <h1>Register Stock</h1>
      </header>

      <main>
        <section className="stock-form">
          <h2>Register Stock Information</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="stockName"
                placeholder="Stock Name"
                value={formData.stockName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="stockSymbol"
                placeholder="Stock Symbol"
                value={formData.stockSymbol}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="industryType"
                placeholder="Industry Type"
                value={formData.industryType}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                name="mktCap"
                placeholder="Market Cap"
                value={formData.mktCap}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="sellRange"
                placeholder="Sell Range"
                value={formData.sellRange}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="buyRange"
                placeholder="Buy Range"
                value={formData.buyRange}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                name="yearlyRating"
                placeholder="Yearly Rating"
                value={formData.yearlyRating}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                name="qtrRating"
                placeholder="Quarterly Rating"
                value={formData.qtrRating}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Register Stock</button>
          </form>
        </section>
      </main>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default HomePage;
