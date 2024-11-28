import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import StockInfoPage from './StockInfoPage';
import StockHeatmap from './StockHeatMap';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Route with symbol parameter */}
        <Route path="/stocks/:symbol" element={<StockInfoPage />} />
        <Route path="/heatmap" element={<StockHeatmap />} />
      </Routes>
    </Router>
  );
};

export default App;
