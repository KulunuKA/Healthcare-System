const express = require("express");
const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware");

console.log("--->> Proxy routes module loaded");

function createProxiedRouter({ serviceUrl, stripPrefix }) {
  const router = express.Router();

  router.use(
    "/",
    createProxyMiddleware({
      target: serviceUrl,
      changeOrigin: true,
      logLevel: "debug",

      pathRewrite: (path) => {
        if (stripPrefix && path.startsWith(stripPrefix)) {
          return path.replace(stripPrefix, "") || "/";
        }
        return path;
      },

      onProxyReq: (proxyReq, req, res) => {
        // ✅ fix body properly (IMPORTANT)
        fixRequestBody(proxyReq, req);

        if (req.requestId) {
          proxyReq.setHeader("x-request-id", req.requestId);
        }

      },

      onProxyRes: (proxyRes, req) => {
        console.log("✅ Response from service:", proxyRes.statusCode, req.originalUrl);
      },

      onError: (err, req, res) => {
        console.error("❌ Proxy error:", err.message);
        res.status(502).json({
          success: false,
          message: "Bad Gateway",
          details: err?.message,
        });
      },
    })
  );

  return router;
}

module.exports = { createProxiedRouter };