"use client";
import { useSearchParams } from "next/navigation";
import { Card, Descriptions, Divider } from "antd";
import { PayButton } from "@/components/PayButton";
import { usePatient } from "@/context/PatientProvider";
import { getSessionValue } from "@/utils/session";

export default function PaymentSummaryPage() {
  const searchParams = useSearchParams();
  const { appointments, user } = usePatient();
  
  const token = getSessionValue("accessToken");
  const appointmentId = searchParams.get("appointmentId");
  const amount = searchParams.get("amount"); 

  const currentAppt = appointments?.find(a => (a._id || a.id) === appointmentId);

  return (
    <div style={{ padding: "40px 20px", maxWidth: "500px", margin: "0 auto" }}>
      <Card title="Appointment Payment" variant="borderless">
        <Descriptions column={1}>
          <Descriptions.Item label="Reference ID">{appointmentId}</Descriptions.Item>
          <Descriptions.Item label="Doctor">{currentAppt?.doctorName || "Medical Professional"}</Descriptions.Item>
          <Descriptions.Item label="Patient">{user?.fullName || "Valued Patient"}</Descriptions.Item>
        </Descriptions>
        
        <Divider />
        
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold" }}>
          <span>Total Fee:</span>
          {/* Displays dynamic fee with 2 decimal places */}
          <span>LKR {parseFloat(amount || 0).toFixed(2)}</span>
        </div>

        <div style={{ marginTop: "30px" }}>
          <PayButton 
            appointmentId={appointmentId}
            amount={amount}
            patientDetails={{
               firstName: user?.fullName?.split(" ")[0] || "Patient",
               lastName: user?.fullName?.split(" ")[1] || "User",
               email: user?.email || "patient@example.com",
               phone: user?.phone || "0771234567"
            }}
            token={token} 
          />
        </div>
      </Card>
    </div>
  );
}