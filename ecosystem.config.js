module.exports = {
  apps: [
    {
      script: 'dist/main.js',
      autorestart: true,
    },
  ],

  deploy: {
    dev: {
      user: 'ubuntu',
      host: '3.131.56.150',
      ref: 'origin/develop',
      repo: 'git@github.com:angel82800/Watertower_backend.git',
      path: '/home/ubuntu/wt_backend_app',
      'post-deploy':
        'git reset --hard HEAD && git pull && yarn install && yarn build && pm2 reload wt-dev',
    },
    demo: {
      user: 'ubuntu',
      host: '18.118.67.255',
      ref: 'origin/staging',
      repo: 'git@github.com:angel82800/Watertower_backend.git',
      path: '/home/ubuntu/wt_backend_app',
      'post-deploy':
        'git reset && git pull && yarn install && yarn build && pm2 reload wt-demo',
    },
    prod: {
      user: 'ubuntu',
      host: '3.134.162.56',
      ref: 'origin/main',
      repo: 'git@github.com:angel82800/Watertower_backend.git',
      path: '/home/ubuntu/wt_backend_app',
      'post-deploy':
        'git reset && git pull && yarn install && yarn build && pm2 reload wt-production',
    },
  },
};
