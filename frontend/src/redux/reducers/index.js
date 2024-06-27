import { combineReducers } from 'redux';
import authReducer from './authReducer';
import portfolioReducer from './portfolioReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  portfolio: portfolioReducer,
});

export default rootReducer;