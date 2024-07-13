const initialState = {
    settings: null,
    loading: false,
    error: null,
  };
  
  const userSettingsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_USER_SETTINGS_START':
        return { ...state, loading: true, error: null };
      case 'FETCH_USER_SETTINGS_SUCCESS':
        return { ...state, settings: action.payload, loading: false };
      case 'FETCH_USER_SETTINGS_FAILURE':
        return { ...state, error: action.payload, loading: false };
      case 'UPDATE_USER_SETTINGS':
        return { ...state, settings: action.payload };
      default:
        return state;
    }
  };
  
  export default userSettingsReducer;