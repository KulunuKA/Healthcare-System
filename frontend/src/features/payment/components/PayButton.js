import React from 'react';
import { usePayment } from '../hooks/usePayment';

export const PayButton = ({ appointmentId, amount, patientDetails }) => {
  const { processPayment, isProcessing } = usePayment();

  return (
    <button
      onClick={() => processPayment(appointmentId, amount, patientDetails)}
      disabled={isProcessing}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:bg-gray-400"
    >
      {isProcessing ? "Connecting to PayHere..." : `Confirm & Pay LKR ${amount}`}
    </button>
  );
};