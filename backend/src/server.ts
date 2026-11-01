import 'dotenv/config';

import { app } from './app.js';

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('------------------------------------');
  console.log('   SIGNATURES API');
  console.log('------------------------------------');
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Network: http://192.168.1.202:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log('------------------------------------');
  console.log('');
});
