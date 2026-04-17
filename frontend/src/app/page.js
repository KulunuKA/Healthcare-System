"use client";

import Link from "next/link";

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
  return (
    <main className="min-h-screen bg-white text-[#2f2d6b] p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">MediConnect Portal</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-all">
              <span className="text-4xl">{service.icon}</span>
              <h3 className="text-xl font-bold mt-4">{service.title}</h3>
              <p className="text-gray-600 mt-2">{service.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/patient/doctors" 
            className="inline-block bg-[#2f2d6b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Start Booking
          </Link>
        </div>
      </div>
    </main>
  );
}