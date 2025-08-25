module.exports = {
    apps: [{
      name: 'gcc-dashboard',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: 'C:/laragon/www/GCC-Dashboard/',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        API_URL: 'https://api.e-nova.xyz/api'
      }
    }]
  }