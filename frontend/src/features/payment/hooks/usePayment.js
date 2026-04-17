import { useState } from 'react';
import { initiatePayHerePayment } from '../services/paymentService';

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async (appointmentId, amount, patientDetails) => {
    setIsProcessing(true);
    try {
      const data = await initiatePayHerePayment(appointmentId, amount, patientDetails);
      
      // Submit to PayHere Sandbox
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://sandbox.payhere.lk/pay/checkout';

      // Attach all parameters returned by the backend
      Object.keys(data.payhereData).forEach((key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data.payhereData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Failed to start payment. Make sure the Payment Service is running!");
    } finally {
      setIsProcessing(false);
    }
  };

  return { processPayment, isProcessing };
};