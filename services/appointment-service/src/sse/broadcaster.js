const appointmentSubscribers = new Map(); // appointmentId -> Set<res>

function subscribe(appointmentId, res) {
  const key = String(appointmentId);
  if (!appointmentSubscribers.has(key)) appointmentSubscribers.set(key, new Set());
  appointmentSubscribers.get(key).add(res);

  res.on("close", () => {
    const set = appointmentSubscribers.get(key);
    if (!set) return;
    set.delete(res);
    if (set.size === 0) appointmentSubscribers.delete(key);
  });
}

function publish(appointmentId, payload) {
  const key = String(appointmentId);
  const set = appointmentSubscribers.get(key);
  if (!set) return;
  const msg = `data: ${JSON.stringify(payload)}\n\n`;
  for (const res of set) {
    res.write(msg);
  }
}

const appointmentSseBroadcaster = { subscribe, publish };

module.exports = { appointmentSseBroadcaster };

