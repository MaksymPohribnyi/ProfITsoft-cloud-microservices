const config = {
  // Services
  USERS_SERVICE: process.env.REACT_APP_USERS_SERVICE || 'http://localhost:3000',
  UI_URL_PREFIX: process.env.REACT_APP_UI_URL_PREFIX || '',

  API_BASE_URL: process.env.REACT_APP_API_URL || '',

  USE_MOCK_AUTH: process.env.REACT_APP_USE_MOCK_AUTH === 'true',

};

export default config;
