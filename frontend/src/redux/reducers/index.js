import { combineReducers } from 'redux';
import authReducer from './authReducer';
import portfolioReducer from './portfolioReducer';
import notificationsReducer from './notificationsReducer';
import userSettingsReducer from './userSettingsReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  portfolio: portfolioReducer,
  notifications: notificationsReducer,
  userSettings: userSettingsReducer,
  settings: settingsReducer,
});

export default rootReducer;