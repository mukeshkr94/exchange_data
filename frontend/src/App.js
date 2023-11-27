import './App.css';


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [exchanges, setExchanges] = useState([]);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
       fetchExchanges();
  }, []);
   // Fetch exchanges from the backend
   const fetchExchanges = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exchanges_list');
      setExchanges(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Filter exchanges based on user input
  const filteredExchanges = exchanges.filter((exchange) =>
  exchange.name && exchange.name.toLowerCase().includes(filter.toLowerCase())
);

  // Paginate the exchanges
  const indexOfLastExchange = currentPage * pageSize;
  const indexOfFirstExchange = indexOfLastExchange - pageSize;
  const currentExchanges = filteredExchanges.slice(indexOfFirstExchange, indexOfLastExchange);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // fetch and save api data into DB
  const fetchAndSaveApiData = async()=>{
    try {
      const response = await axios.get('http://localhost:5000/api/fetch-exchanges');
      fetchExchanges();
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Filter exchanges"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <button onClick={fetchAndSaveApiData} id='fetchapidata-btn'>Fetch & Save API Data</button>
      <hr/>
      <table>
        <thead>
          <tr>
          <th>Exchanges</th>
          <th>24H Trade Volume</th>
          </tr>
          
        </thead>
        <tbody>
          {
              currentExchanges.map((exchange, i) => (
                <tr key={exchange.exchange_id}>
                <td>
                <span>{i+1}</span>
                <span id='icon-img'><img src={exchange.url} alt=""/></span>
                <span>{exchange.name}</span>
                </td>
                <td>$ {exchange.volume_1day_usd}</td>
                </tr>
              ))
          }
          
        </tbody>
      </table>
      <div>
        {Array.from({ length: Math.ceil(filteredExchanges.length / pageSize) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
