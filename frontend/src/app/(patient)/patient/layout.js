import PatientLayout from '@/components/patient/PatientLayout';

export default function PatientRouteLayout({ children }) {
  return (
    <PatientLayout>
      {children}
    </PatientLayout>
  );
}
