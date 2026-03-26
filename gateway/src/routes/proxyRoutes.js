const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

function createProxiedRouter({ serviceUrl }) {
  const router = express.Router();

  router.use(
    "/",
    createProxyMiddleware({
      target: serviceUrl,
      changeOrigin: true,
      xfwd: true,
      logLevel: "warn",
      onProxyReq: (proxyReq, req) => {
        if (req.requestId) proxyReq.setHeader("x-request-id", req.requestId);
      },
      onError: (err, req, res) => {
        res.status(502).json({ success: false, message: "Bad Gateway", details: err?.message });
      },
    })
  );

  return router;
}

module.exports = { createProxiedRouter };

