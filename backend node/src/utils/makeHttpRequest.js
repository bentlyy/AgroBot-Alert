const axios = require('axios');

const makeHttpRequest = async (url, params) => {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error en la solicitud HTTP:', error);
    throw new Error('Error en la solicitud HTTP');
  }
}

module.exports = makeHttpRequest;
