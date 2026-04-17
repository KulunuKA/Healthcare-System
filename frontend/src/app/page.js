"use client"; // REQUIRED because the button has click events

import Link from "next/link";
import { PayButton } from "../features/payment/components/PayButton";

const services = [
  {
    title: "Emergency Department",
    description: "Quick access to urgent medical care and emergency support.",
    icon: "🚨",
  },
  {
    title: "Pediatric Department",
    description: "Compassionate healthcare services designed for children.",
    icon: "👶",
  },
  {
    title: "General Physician",
    description: "Consult with experienced doctors for general health issues.",
    icon: "🩺",
  },
  {
    title: "Neurology Department",
    description: "Advanced care and consultation for neurological conditions.",
    icon: "🧠",
  },
  {
    title: "Cardiology Department",
    description: "Professional heart care, monitoring, and specialist support.",
    icon: "💙",
  },
];

export default function HomePage() {
  // Mock data to test the integration
  const mockAppointment = {
    id: "65f1a2b3c4d5e6f7a8b9c0d1",
    amount: 1500,
    patient: {
      firstName: "Saman",
      lastName: "Perera",
      email: "saman@example.com",
      phone: "0771234567"
    }
  };

  console.log(mockAppointment)

  return (
    <main className="min-h-screen bg-white text-[#2f2d6b] p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">MediConnect Portal</h1>
        
        {/* --- PAYMENT TEST SECTION --- */}
        <section className="mb-12 p-8 border-2 border-blue-100 rounded-2xl bg-blue-50">
          <h2 className="text-2xl font-semibold mb-4">Confirm Your Booking</h2>
          <p className="text-lg mb-6">Total Consultation Fee: <span className="font-bold text-blue-700">LKR {mockAppointment.amount}.00</span></p>
          
          <div className="max-w-xs">
            <PayButton 
              appointmentId={mockAppointment.id}
              amount={mockAppointment.amount}
              patientDetails={mockAppointment.patient}
            />
          </div>
          <p className="mt-4 text-sm text-gray-500 italic">
            * Note: This will redirect you to the PayHere Sandbox for testing.
          </p>
        </section>

        {/* --- SERVICES SECTION --- */}
        <h2 className="text-2xl font-semibold mb-6">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-all">
              <span className="text-4xl">{service.icon}</span>
              <h3 className="text-xl font-bold mt-4">{service.title}</h3>
              <p className="text-gray-600 mt-2">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}