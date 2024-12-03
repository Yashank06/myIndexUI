import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeaderNav from './component/HeaderNav';
import Footer from './component/Footer';
import StockInfoPage from './StockInfoPage';
import StockHeatmap from './StockHeatMap';
import HomePage from './component/HomePage';
import StockFileUpload from './component/StockFileUpload';

const App = () => {
  return (
    <Router>
      <HeaderNav /> {/* Include HeaderNav for navigation */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stocks/:symbol" element={<StockInfoPage />} />
          <Route path="/heatmap" element={<StockHeatmap />} />
          <Route path="/news" element={<div>Market News Coming Soon</div>} />
          <Route path="/StockFileUpload" element={<StockFileUpload />} />
        </Routes>
      </main>
      <Footer /> {/* Include Footer for consistent layout */}
    </Router>
  );
};

export default App;
