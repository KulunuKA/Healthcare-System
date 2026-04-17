const generateMeetingLink = (appointmentId) => {
    const roomName = `healthcare-appointment-${appointmentId}`;
    return `https://meet.jit.si/${roomName}`;
  };
  
  module.exports = { generateMeetingLink };