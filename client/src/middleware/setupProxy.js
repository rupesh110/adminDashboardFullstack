const { createProxyMiddleware } = require('http-proxy-middleware');

const backendUrl = 'https://admin-backend-iygm.onrender.com/';

module.exports = function (app) {
  app.use(
    '/api', 
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true, 
    })
  );
};
