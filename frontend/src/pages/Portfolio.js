import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioChange, setPortfolioChange] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [chartData, setChartData] = useState({});
  const [timePeriod, setTimePeriod] = useState('1M');
  const [comparisonAssets, setComparisonAssets] = useState([]);

  useEffect(() => {
    // Fetch portfolio data from API
    fetchPortfolioData();

    // Set up real-time price updates
    const intervalId = setInterval(fetchPortfolioData, 60000); // Update every minute
    return () => clearInterval(intervalId);
  }, []);

  const fetchPortfolioData = () => {
    axios.get('/api/v1/portfolios')
      .then(response => {
        setPortfolio(response.data);
        // Calculate overall portfolio value and change
        let totalValue = 0;
        let totalChange = 0;
        response.data.forEach(asset => {
          totalValue += asset.total_value;
          totalChange += asset.change;
        });
        setPortfolioValue(totalValue);
        setPortfolioChange(totalChange);

        // Prepare chart data
        const labels = response.data.map(asset => asset.name);
        const data = response.data.map(asset => asset.total_value);
        setChartData({
          labels,
          datasets: [
            {
              label: 'Portfolio Value',
              data,
              borderColor: '#c07830',
              backgroundColor: '#f5e6d6',
            },
          ],
        });
      })
      .catch(error => console.error(error));
  };

  const openModal = (asset = null) => {
    setCurrentAsset(asset);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setCurrentAsset(null);
    setModalIsOpen(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const { symbol, shares, cost } = event.target.elements;

    const assetData = {
      symbol: symbol.value,
      shares: shares.value,
      cost: cost.value,
    };

    if (currentAsset) {
      // Update existing asset
      axios.put(`/api/v1/portfolios/${currentAsset.id}`, assetData)
        .then(response => {
          setPortfolio(portfolio.map(asset => asset.id === currentAsset.id ? response.data : asset));
          closeModal();
        })
        .catch(error => console.error(error));
    } else {
      // Add new asset
      axios.post('/api/v1/portfolios', assetData)
        .then(response => {
          setPortfolio([...portfolio, response.data]);
          closeModal();
        })
        .catch(error => console.error(error));
    }
  };

  const handleDelete = (id) => {
    axios.delete(`/api/v1/portfolios/${id}`)
      .then(() => {
        setPortfolio(portfolio.filter(asset => asset.id !== id));
      })
      .catch(error => console.error(error));
  };

  const filteredPortfolio = portfolio.filter(asset =>
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
    // Fetch and set data for the selected time period
    // Placeholder: You can add API call here to get data for selected time period
  };

  const handleComparisonChange = (event) => {
    const selectedSymbols = Array.from(event.target.selectedOptions, option => option.value);
    setComparisonAssets(selectedSymbols);
    // Fetch and set comparison data
    // Placeholder: You can add API call here to get comparison data
  };

  return (
    <div className="portfolio-container p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl">Sihle's Shares</h1>
        <div>
          <span className="text-xl font-bold">${portfolioValue.toFixed(2)}</span>
          <span className={`text-xl ${portfolioChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {portfolioChange >= 0 ? `+${portfolioChange.toFixed(2)} (${(portfolioChange / portfolioValue * 100).toFixed(2)}%)` : `${portfolioChange.toFixed(2)} (${(portfolioChange / portfolioValue * 100).toFixed(2)}%)`}
          </span>
        </div>
        <div>
          <button className="btn btn-primary mr-2" onClick={() => openModal()}>+ Add Symbol</button>
        </div>
      </header>
      <div className="search-bar mb-4">
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="chart-options mb-4">
        <label>Time Period:</label>
        <select value={timePeriod} onChange={handleTimePeriodChange} className="ml-2">
          <option value="1W">1 Week</option>
          <option value="1M">1 Month</option>
          <option value="3M">3 Months</option>
          <option value="1Y">1 Year</option>
        </select>
        <label className="ml-4">Compare With:</label>
        <select multiple value={comparisonAssets} onChange={handleComparisonChange} className="ml-2">
          {portfolio.map(asset => (
            <option key={asset.id} value={asset.symbol}>{asset.symbol}</option>
          ))}
        </select>
      </div>
      <div className="chart-container mb-4">
        <Line data={chartData} />
      </div>
      <div className="holdings-table">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4">Symbol</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Change</th>
              <th className="py-2 px-4">Shares</th>
              <th className="py-2 px-4">Cost</th>
              <th className="py-2 px-4">Today's Gain</th>
              <th className="py-2 px-4">Total Change</th>
              <th className="py-2 px-4">Value</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPortfolio.map(asset => (
              <tr key={asset.id}>
                <td className="py-2 px-4"><Link to={`/market-data/${asset.symbol}`}>{asset.symbol}</Link></td>
                <td className="py-2 px-4">{asset.price.toFixed(2)}</td>
                <td className="py-2 px-4" style={{ color: asset.change >= 0 ? 'green' : 'red' }}>{asset.change.toFixed(2)}%</td>
                <td className="py-2 px-4">{asset.shares}</td>
                <td className="py-2 px-4">{asset.cost.toFixed(2)}</td>
                <td className="py-2 px-4">{asset.today_gain.toFixed(2)}</td>
                <td className="py-2 px-4">{asset.total_change.toFixed(2)}</td>
                <td className="py-2 px-4">{asset.total_value.toFixed(2)}</td>
                <td className="py-2 px-4">
                  <button className="btn btn-secondary mr-2" onClick={() => openModal(asset)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(asset.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>{currentAsset ? 'Edit Asset' : 'Add Asset'}</h2>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label>Symbol</label>
            <input name="symbol" defaultValue={currentAsset?.symbol || ''} required />
          </div>
          <div className="mb-4">
            <label>Shares</label>
            <input name="shares" type="number" defaultValue={currentAsset?.shares || ''} required />
          </div>
          <div className="mb-4">
            <label>Cost</label>
            <input name="cost" type="number" step="0.01" defaultValue={currentAsset?.cost || ''} required />
          </div>
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-accent" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default Portfolio;
