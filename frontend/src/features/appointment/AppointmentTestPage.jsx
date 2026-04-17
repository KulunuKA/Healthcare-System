import React from 'react';
import { PayButton } from '../payment/components/PayButton';

const AppointmentTestPage = () => {
  // These would normally come from your database
  const mockAppointment = {
    id: "65f1a2b3c4d5e6f7a8b9c0d1", // A fake MongoDB ID
    amount: 1500,
    patient: {
      firstName: "Saman",
      lastName: "Perera",
      email: "saman@example.com",
      phone: "0771234567"
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto', textAlign: 'center', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h2>Confirm Appointment</h2>
      <p>Doctor: <strong>Dr. Silva</strong></p>
      <p>Fee: <strong>LKR {mockAppointment.amount}.00</strong></p>
      <hr />
      
      {/* Our PayButton Component */}
      <PayButton 
        appointmentId={mockAppointment.id}
        amount={mockAppointment.amount}
        patientDetails={mockAppointment.patient}
      />
      
      <p style={{ fontSize: '12px', color: 'gray', marginTop: '10px' }}>
        Clicking this will take you to the PayHere Sandbox.
      </p>
    </div>
  );
};

export default AppointmentTestPage;