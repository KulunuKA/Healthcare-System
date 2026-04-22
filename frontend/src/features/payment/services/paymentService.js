import axios from 'axios';

const API_BASE_URL = 'https://38f5-2407-c00-e001-8d04-e960-57e6-f55e-c29b.ngrok-free.app';

export const initiatePayHerePayment = async (appointmentId, amount, patientDetails) => {
  const response = await axios.post(`${API_BASE_URL}/initiate`, {
    provider: 'payhere',
    appointmentId,
    amount,
    patientDetails
  });
  return response.data.data; 
};