const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://xxx.xxx.com/',
      secure: false,
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/api/event/', {
      target: 'https://xxx.xxx.com/',
      ws: true,
      secure: false,
      changeOrigin: true,
    }),
  );
};
