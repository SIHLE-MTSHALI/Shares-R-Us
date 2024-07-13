export const fetchUserSettingsStart = () => ({ type: 'FETCH_USER_SETTINGS_START' });
export const fetchUserSettingsSuccess = (settings) => ({ type: 'FETCH_USER_SETTINGS_SUCCESS', payload: settings });
export const fetchUserSettingsFailure = (error) => ({ type: 'FETCH_USER_SETTINGS_FAILURE', payload: error });
export const updateUserSettings = (settings) => ({ type: 'UPDATE_USER_SETTINGS', payload: settings });