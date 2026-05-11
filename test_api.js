const axios = require('axios');

async function testApi() {
  try {
    const res = await axios.post('https://backend-fincavalerio.onrender.com/api/inseminacion/crear', {
      id_veterinario: 1,
      id_ciclo: 1,
      tipo_inseminacion: 'Artificial',
      resultado: 'Pendiente',
      fecha: '2026-05-11'
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

testApi();
