const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('https://backend-fincavalerio.onrender.com/api/bovino/crear', {});
    console.log('Respuesta:', res.data);
  } catch (error) {
    console.log('ERROR RECIBIDO:', error.response?.data);
  }
}

test();
