"use client";

import { Button, message } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";

export const PayButton = ({ appointmentId, amount, patientDetails, token }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!window.payhere) {
      message.error("Payment gateway is still loading.");
      return;
    }

    // 1. DYNAMIC TOKEN CHECK
    // Priority: Prop > accessToken (your session key) > token (fallback)
    const authToken = token || localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (!authToken) {
      message.error("Session missing. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/payments/initiate",
        {
          provider: "payhere",
          appointmentId,
          amount,
          patientDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (res.data.success) {
        const { payhereData } = res.data.data;

        const payment = {
          sandbox: true, 
          merchant_id: payhereData.merchant_id,
          return_url: payhereData.return_url,
          cancel_url: payhereData.cancel_url,
          notify_url: payhereData.notify_url,
          order_id: payhereData.order_id,
          items: payhereData.items,
          amount: payhereData.amount,
          currency: payhereData.currency,
          hash: payhereData.hash, 
          first_name: payhereData.first_name,
          last_name: payhereData.last_name,
          email: payhereData.email,
          phone: payhereData.phone,
          address: "Colombo",
          city: "Colombo",
          country: "Sri Lanka",
        };

        window.payhere.onCompleted = () => message.success("Payment successful!");
        window.payhere.onDismissed = () => message.warning("Payment canceled.");
        window.payhere.onError = (err) => message.error("PayHere Error: " + err);

        window.payhere.startPayment(payment);
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      if (error.response?.status === 401) {
        message.error("Authorization failed. Please re-login.");
      } else {
        message.error(error.response?.data?.message || "Payment service unavailable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="primary"
      icon={<WalletOutlined />}
      size="large"
      block
      loading={loading}
      style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", height: "50px" }}
      onClick={handlePayment}
    >
      Proceed to Pay
    </Button>
  );
};