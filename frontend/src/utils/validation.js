export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  export const validatePassword = (password) => {
    return password.length >= 8;
  };
  
  export const validateNumber = (number) => {
    return !isNaN(parseFloat(number)) && isFinite(number);
  };
  
  export const validateRequired = (value) => {
    return value !== null && value !== undefined && value.trim() !== '';
  };