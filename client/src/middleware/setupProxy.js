const { createProxyMiddleware } = require('http-proxy-middleware');

const backendUrl = 'https://admin-backend-iygm.onrender.com/';

module.exports = function (app) {
  app.use(
    '/api', // This is the base URL where your API requests will be redirected to the backend.
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true, // Change the origin of the host header to the target URL.
    })
  );
};
