const initialState = {
    locale: 'en-ZA', // Default to South African English
  };
  
  const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_LOCALE':
        return { ...state, locale: action.payload };
      default:
        return state;
    }
  };
  
  export default settingsReducer;