function formatMeta(meta) {
  if (!meta || typeof meta !== "object") return meta;
  return Object.keys(meta).reduce((acc, k) => {
    const v = meta[k];
    if (v === undefined) return acc;
    acc[k] = v;
    return acc;
  }, {});
}

function log(level, message, meta) {
  const payload = {
    level,
    message,
    time: new Date().toISOString(),
    ...(meta ? { meta: formatMeta(meta) } : {}),
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));
}

const logger = {
  info: (message, meta) => log("info", message, meta),
  warn: (message, meta) => log("warn", message, meta),
  error: (message, meta) => log("error", message, meta),
  debug: (message, meta) => log("debug", message, meta),
};

module.exports = logger;

