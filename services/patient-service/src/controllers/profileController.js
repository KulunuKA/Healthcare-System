const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');

function getUserIdFromReq(req) {
  const auth = req.headers?.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    return decoded.sub || decoded.id || decoded.userId || decoded._id || decoded.email || null;
  } catch (e) {
    return null;
  }
}

async function findPatientByUserId(userId) {
  if (!userId) return null;
  const isObjectId = /^[a-fA-F0-9]{24}$/.test(String(userId));
  if (isObjectId) {
    try {
      const p = await Patient.findById(userId).lean();
      if (p) return p;
    } catch (e) {
      // ignore and fallback to email search
    }
  }
  if (String(userId).includes('@')) {
    return Patient.findOne({ email: String(userId).toLowerCase() }).lean();
  }
  // fallback: try by _id or email
  return Patient.findOne({ $or: [{ _id: userId }, { email: String(userId).toLowerCase() }] }).lean();
}

exports.getProfile = async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Missing Authorization header' });

  try {
    const patient = await findPatientByUserId(userId);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    const profile = patient.profile || {
      fullName: '', phone: '', gender: '', dateOfBirth: null,
      address: { street: '', city: '', state: '', zip: '' }
    };

    return res.json({ success: true, profile });
  } catch (err) {
    console.error('getProfile error', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Missing Authorization header' });

  const incoming = req.body || {};

  try {
    // find the patient document (not lean so we can save)
    let patient;
    const isObjectId = /^[a-fA-F0-9]{24}$/.test(String(userId));
    if (isObjectId) {
      patient = await Patient.findById(userId);
    }
    if (!patient) {
      patient = await Patient.findOne({ $or: [{ email: String(userId).toLowerCase() }, { _id: userId }] });
    }

    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    const existing = patient.profile || {};

    // merge profile fields
    const merged = {
      ...existing,
      ...incoming,
      address: {
        ...(existing.address || {}),
        ...(incoming.address || {}),
      },
    };

    patient.profile = merged;
    await patient.save();

    return res.json({ success: true, profile: patient.profile });
  } catch (err) {
    console.error('updateProfile error', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

