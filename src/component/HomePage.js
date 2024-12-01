import React, { useState } from "react";
import axios from "axios";

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
  const [showPopup, setShowPopup] = useState(false);

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
      setShowPopup(true);
    } catch (error) {
      setResponseMessage("Error registering stock. Please try again.");
      console.error("Error:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
    <form className="form-container" onSubmit={handleSubmit}>
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
            <label htmlFor="industryType">Industry Type</label>
            <select
              id="industryType"
              name="industryType"
              value={formData.industryType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Industry</option>
              <option value="Finance">Finance</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Consumer Goods">Consumer Goods</option>
              <option value="Energy">Energy</option>
              <option value="Automobile">Automobile</option>
              <option value="Telecommunication">Telecommunication</option>
              <option value="Pharmaceuticals">Pharmaceuticals</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Metals and Mining">Metals and Mining</option>
              <option value="Media and Entertainment">Media and Entertainment</option>
              <option value="Retail">Retail</option>
            </select>
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
              name="buyRange"
              placeholder="Buy Range (Ex - 110-120)"
              value={formData.buyRange}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="sellRange"
              placeholder="Sell Range (Ex - 150-160)"
              value={formData.sellRange}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="yearlyRating">Yearly Rating</label>
            <select
              id="yearlyRating"
              name="yearlyRating"
              value={formData.yearlyRating}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="qtrRating">Quarterly Rating</label>
            <select
              id="qtrRating"
              name="qtrRating"
              value={formData.qtrRating}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <button type="submit" className="submit-button">
        Submit
      </button>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>{responseMessage}</h3>
            <button className="close-btn" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
        </form>
        </div>
  );
};

export default HomePage;
