import { combineReducers } from 'redux';
import authReducer from './authReducer';
import portfolioReducer from './portfolioReducer';
import notificationsReducer from './notificationsReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  portfolio: portfolioReducer,
  notifications: notificationsReducer,
});

export default rootReducer;