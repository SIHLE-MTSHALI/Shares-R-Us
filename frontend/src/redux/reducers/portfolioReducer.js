import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  portfolios: [],
  loading: false,
  error: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    fetchPortfoliosStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPortfoliosSuccess: (state, action) => {
      state.portfolios = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchPortfoliosFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addPortfolio: (state, action) => {
      state.portfolios.push(action.payload);
    },
    updatePortfolio: (state, action) => {
      const index = state.portfolios.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.portfolios[index] = action.payload;
      }
    },
    deletePortfolio: (state, action) => {
      state.portfolios = state.portfolios.filter(p => p.id !== action.payload);
    },
  },
});

export const {
  fetchPortfoliosStart,
  fetchPortfoliosSuccess,
  fetchPortfoliosFailure,
  addPortfolio,
  updatePortfolio,
  deletePortfolio,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;