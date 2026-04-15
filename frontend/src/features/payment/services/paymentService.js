import axios from 'axios';

const API_BASE_URL = 'https://cone-quartered-scribe.ngrok-free.dev';

export const initiatePayHerePayment = async (appointmentId, amount, patientDetails) => {
  const response = await axios.post(`${API_BASE_URL}/initiate`, {
    provider: 'payhere',
    appointmentId,
    amount,
    patientDetails
  });
  return response.data.data; 
};