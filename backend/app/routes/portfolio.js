const express = require('express');
const router = express.Router();
const Portfolio = require('../models/portfolio');

// Fetch all portfolios
router.get('/', async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new asset to the portfolio
router.post('/', async (req, res) => {
  const { symbol, shares, cost } = req.body;
  const portfolio = new Portfolio({
    symbol,
    shares,
    cost,
    price: 0,
    change: 0,
    today_gain: 0,
    total_change: 0,
    total_value: 0,
  });

  try {
    const newPortfolio = await portfolio.save();
    res.status(201).json(newPortfolio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an asset in the portfolio
router.put('/:id', getPortfolio, async (req, res) => {
  const { symbol, shares, cost } = req.body;
  if (symbol != null) res.portfolio.symbol = symbol;
  if (shares != null) res.portfolio.shares = shares;
  if (cost != null) res.portfolio.cost = cost;

  try {
    const updatedPortfolio = await res.portfolio.save();
    res.json(updatedPortfolio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an asset from the portfolio
router.delete('/:id', getPortfolio, async (req, res) => {
  try {
    await res.portfolio.remove();
    res.json({ message: 'Asset deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get portfolio by ID
async function getPortfolio(req, res, next) {
  let portfolio;
  try {
    portfolio = await Portfolio.findById(req.params.id);
    if (portfolio == null) return res.status(404).json({ message: 'Cannot find asset' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.portfolio = portfolio;
  next();
}

module.exports = router;
