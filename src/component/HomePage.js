import React, { useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

const API_BASE_URL = "https://myindex-production.up.railway.app";

const HomePage = () => {
  const [formData, setFormData] = useState({
    stockName: "",
    stockSymbol: "",
    industryType: "",
    mktCap: "",
    buyLowerLimit: "",
    buyUpperLimit: "",
    sellLowerLimit: "",
    sellUpperLimit: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedFetchSuggestions = debounce(async (value) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/myIndex/stocks/search?name=${value}`);
      if (Array.isArray(response.data)) {
        setSuggestions(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setSuggestions([]);
      }
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching stock suggestions:", error);
      setSuggestions([]);
    }
  }, 300);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Clear other fields if stockName is empty
    if (name === "stockName" && value.trim() === "") {
      setFormData({
        stockName: "",
        stockSymbol: "",
        industryType: "",
        mktCap: "",
        buyLowerLimit: "",
        buyUpperLimit: "",
        sellLowerLimit: "",
        sellUpperLimit: "",
      });
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "stockName" && value.trim().length >= 1) {
      debouncedFetchSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({
      ...formData,
      stockName: suggestion.stockName,
      stockSymbol: suggestion.stockSymbol,
      industryType: suggestion.industryType,
      mktCap: suggestion.marketCap,
    });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine ranges into single fields for API payload
    const payload = {
      ...formData,
      buyRange: `${formData.buyLowerLimit}-${formData.buyUpperLimit}`,
      sellRange: `${formData.sellLowerLimit}-${formData.sellUpperLimit}`,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/myIndex/myStock`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setResponseMessage("Stock successfully registered!");
      console.log("Response:", response.data);
      setShowPopup(true);
      resetForm();
    } catch (error) {
      setResponseMessage("Error registering stock. Please try again.");
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      stockName: "",
      stockSymbol: "",
      industryType: "",
      mktCap: "",
      buyLowerLimit: "",
      buyUpperLimit: "",
      sellLowerLimit: "",
      sellUpperLimit: "",
    });
    setSuggestions([]);
    setShowSuggestions(false);
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
            placeholder="Start searching your stock"
            value={formData.stockName}
            onChange={handleInputChange}
            required
            aria-label="Enter Stock Name"
          />
          {showSuggestions && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onKeyDown={(e) => e.key === "Enter" && handleSuggestionClick(suggestion)}
                  tabIndex={0} // Accessibility
                >
                  {suggestion.stockName}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="stockSymbol"
            placeholder="Stock Symbol"
            value={formData.stockSymbol}
            readOnly
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="industryType"
            placeholder="Industry Type"
            value={formData.industryType}
            readOnly
          />
        </div>
        <div className="form-group">
  <label>Buy Range:</label>
  <div className="range-fields">
    <input
      type="text"
      name="buyLowerLimit"
      placeholder="Lower Limit (e.g., 110)"
      value={formData.buyLowerLimit || ""}
      onChange={(e) => setFormData({ ...formData, buyLowerLimit: e.target.value })}
      required
    />
    <input
      type="text"
      name="buyUpperLimit"
      placeholder="Upper Limit (e.g., 120)"
      value={formData.buyUpperLimit || ""}
      onChange={(e) => setFormData({ ...formData, buyUpperLimit: e.target.value })}
      required
    />
  </div>
</div>
<div className="form-group">
  <label>Sell Range:</label>
  <div className="range-fields">
    <input
      type="text"
      name="sellLowerLimit"
      placeholder="Lower Limit (e.g., 220)"
      value={formData.sellLowerLimit || ""}
      onChange={(e) => setFormData({ ...formData, sellLowerLimit: e.target.value })}
      required
    />
    <input
      type="text"
      name="sellUpperLimit"
      placeholder="Upper Limit (e.g., 230)"
      value={formData.sellUpperLimit || ""}
      onChange={(e) => setFormData({ ...formData, sellUpperLimit: e.target.value })}
      required
    />
  </div>
</div>

        <button type="submit" className="submit-button">
        Save or Update
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
