const { spawn } = require('child_process');
const path = require('path');

const child = spawn('npm', ['start'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    API_URL: 'https://api.e-nova.xyz/api',
    NODE_ENV: 'production',
    PORT: 3000
  }
});

child.on('error', (error) => {
  console.error('Error:', error);
});

child.on('exit', (code) => {
  console.log('Process exited with code:', code);
});