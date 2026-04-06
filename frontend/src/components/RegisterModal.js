import { Modal } from "antd";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterModal({ isOpen, onClose }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(null);

  const roles = [
    {
      key: "patient",
      label: "Patient",
      sub: "Book appointments & manage health",
      src: "/patient.png",
      route: "/register/patient",
      accent: "#3B82F6",
      bg: "#EFF6FF",
      badge: "Personal",
    },
    {
      key: "doctor",
      label: "Doctor",
      sub: "Manage patients & consultations",
      src: "/images/doctor.jpeg",
      route: "/register/doctor",
      accent: "#0EA5E9",
      bg: "#F0F9FF",
      badge: "Professional",
    },
  ];

return (
    <>
        <Modal
            title={null}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={'50%'}
            style={{
                borderRadius: 20,
                padding: 0,
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid #e8edf5',
            }}
        >
            {/* Header */}
            <div className="px-8 pt-7 pb-0 bg-white">
                <h3 className="font-serif text-2xl font-semibold text-slate-900 -tracking-[0.3px]">
                    Create your account
                </h3>
            </div>

            {/* Body */}
            <div className="px-8 pb-8 pt-5 bg-white">
                <p className="text-base text-slate-400 mb-5">Choose how you'd like to register</p>

                <div className="grid grid-cols-2 gap-4">
                    {roles.map((role) => {
                        const isActive = hovered === role.key;
                        const cardActive =
                            isActive && role.key === 'patient'
                                ? 'border-[#3B82F6] bg-[#EFF6FF]'
                                : isActive && role.key === 'doctor'
                                ? 'border-[#0EA5E9] bg-[#F0F9FF]'
                                : '';

                        const badgeClass =
                            role.key === 'patient'
                                ? 'bg-[#DBEAFE] text-[#2563EB]'
                                : 'bg-[#BAE6FD] text-[#0284C7]';

                        const imgWrapClass =
                            role.key === 'patient' ? 'bg-[#DBEAFE]' : 'bg-[#BAE6FD]';

                        const btnClass =
                            role.key === 'patient'
                                ? 'bg-[#3B82F6] hover:bg-[#2563EB] shadow-[0_4px_14px_rgba(59,130,246,0.4)]'
                                : 'bg-[#0EA5E9] hover:bg-[#0284C7] shadow-[0_4px_14px_rgba(14,165,233,0.4)]';

                        return (
                            <div
                                key={role.key}
                                className={`relative flex flex-col items-center p-7 rounded-xl border-2 border-gray-100 bg-slate-50 cursor-pointer transition-transform duration-200 ease-in-out text-center ${cardActive}`}
                                onMouseEnter={() => setHovered(role.key)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <span
                                    className={`absolute top-3 right-3 text-xs font-semibold uppercase px-2 py-0.5 rounded-full font-sans ${badgeClass}`}
                                >
                                    {role.badge}
                                </span>

                                <div className={`w-18 h-18 rounded-full flex items-center justify-center mb-3 ${imgWrapClass}`}>
                                    <Image src={role.src} alt={role.label} width={44} height={44} />
                                </div>

                                <p className="text-base font-semibold text-slate-900 mb-1">{role.label}</p>
                                <p className="text-sm text-slate-400 mb-4 leading-relaxed">{role.sub}</p>

                                <button
                                    className={`text-white font-semibold text-sm px-5 py-2 rounded-lg ${btnClass}`}
                                    onClick={() =>{
                                        router.push(role.route);
                                        onClose();
                                    }}
                                >
                                    Register →
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3 mt-6">
                    <div className="flex-1 h-px bg-slate-100" />
                    <div className="text-xs text-slate-300">or</div>
                    <div className="flex-1 h-px bg-slate-100" />
                </div>

                <p className="text-center text-sm text-slate-400 mt-3">
                    Already have an account? <a href="/login" className="text-[#3B82F6] font-semibold">Sign in</a>
                </p>
            </div>
        </Modal>
    </>
);
}