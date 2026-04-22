const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

/**
 * Adds computed scheduling / link-visibility fields for API responses.
 */
function serializeTelemedicineRequest(doc) {
  if (!doc) return null;
  const o =
    typeof doc.toObject === "function"
      ? doc.toObject()
      : JSON.parse(JSON.stringify(doc));
  o.id = String(o._id);
  delete o.__v;
  if (o.patientId != null) o.patientId = String(o.patientId);
  if (o.doctorId != null) o.doctorId = String(o.doctorId);
  o.paid = o.paid === true;

  if (o.scheduledAt && o.meetingLink) {
    const sched = new Date(o.scheduledAt);
    const linkFrom = new Date(sched.getTime() - TWO_DAYS_MS);
    o.linkVisibleFrom = linkFrom.toISOString();
    o.isMeetingLinkVisible = Date.now() >= linkFrom.getTime();
  } else {
    o.linkVisibleFrom = null;
    o.isMeetingLinkVisible = false;
  }

  return o;
}

/**
 * Patient-facing: hide meeting link until the session is paid for and the
 * visibility window (e.g. two days before start) is active.
 */
function scrubMeetingLinkForPatient(serialized) {
  if (!serialized) return null;
  const paid = serialized.paid === true;
  if (!paid || !serialized.isMeetingLinkVisible) {
    return { ...serialized, meetingLink: null };
  }
  return serialized;
}

module.exports = {
  serializeTelemedicineRequest,
  scrubMeetingLinkForPatient,
};
