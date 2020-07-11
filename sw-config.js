// sw-config.js
module.exports = {
  runtimeCaching: [
    {
      urlPattern: '/api/*',
      handler: 'networkFirst',
    },
  ],
};
