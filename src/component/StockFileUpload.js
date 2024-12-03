import React, { useState } from 'react';
import axios from 'axios';
import'../StockFileUpload.css';

const API_BASE_URL = "https://myindex-production.up.railway.app";

const StockFileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/myIndex/stocks/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('File uploaded successfully: ' + response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Failed to upload file: ' + error.response?.data || error.message);
    }
  };

  return (
    <div className='stock-form-container'>
      <h1>Upload Stock Data File</h1>
      <form className='stock-form' onSubmit={handleFileUpload}>
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Upload</button>
      </form>
      <div>{message}</div>
    </div>
  );
};

export default StockFileUpload;
