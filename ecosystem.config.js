module.exports = {
    apps: [
      {
        name: 'gcc-dashboard',
        script: 'npm',
        args: 'start',
        cwd: 'C:\laragon\www\GCC-Dashboard', // Update this path to your actual project directory
        instances: 'max', // Use all available CPU cores
        exec_mode: 'cluster',
        env: {
          NODE_ENV: 'production',
          PORT: 3000
        },
        env_production: {
          NODE_ENV: 'production',
          PORT: 3000
        },
        // PM2 specific options
        max_memory_restart: '1G',
        min_uptime: '10s',
        max_restarts: 10,
        restart_delay: 4000,
        // Logging
        log_file: './logs/combined.log',
        out_file: './logs/out.log',
        error_file: './logs/error.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        // Auto restart on file changes (optional)
        watch: false,
        ignore_watch: ['node_modules', 'logs', '*.log']
      }
    ]
  };
  