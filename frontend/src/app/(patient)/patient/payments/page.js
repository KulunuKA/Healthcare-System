"use client";

import { useEffect, useState } from "react";
import { Table, Tag, Card, message, Spin, Typography, Space } from "antd";
import { HistoryOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { getSessionValue } from "@/utils/session";

const { Title, Text } = Typography;

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = getSessionValue("accessToken");
        const res = await axios.get("http://localhost:4000/api/payments/history/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(res.data.data);
      } catch (error) {
        console.error("History Error:", error);
        message.error("Unable to load payment records");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (date) => (
        <Space direction="vertical" size={0}>
          <Text strong>{dayjs(date).format("DD MMM YYYY")}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{dayjs(date).format("hh:mm A")}</Text>
        </Space>
      ),
    },
    {
      title: "Transaction ID",
      dataIndex: "_id",
      key: "id",
      render: (id) => <Text copyable type="secondary">{id.substring(0, 10)}...</Text>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <Text strong>LKR {parseFloat(amount).toFixed(2)}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          succeeded: { color: "green", icon: <CheckCircleOutlined />, text: "SUCCESS" },
          initiated: { color: "blue", icon: <SyncOutlined spin />, text: "INITIATED" },
          pending: { color: "orange", icon: <SyncOutlined spin />, text: "PENDING" },
          failed: { color: "red", icon: <CloseCircleOutlined />, text: "FAILED" },
        };
        const config = statusConfig[status] || { color: "default", text: status.toUpperCase() };
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
  ];

  if (loading) return <div style={{ textAlign: "center", padding: "100px" }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: "40px" }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2} style={{ margin: 0, color: "#1a337e" }}>
            <HistoryOutlined /> Payment History
          </Title>
          <Text type="secondary">View and manage your recent consultation payments.</Text>
        </div>

        <Card variant="borderless" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.05)", borderRadius: '12px' }}>
          <Table 
            dataSource={payments} 
            columns={columns} 
            rowKey="_id" 
            pagination={{ pageSize: 7 }}
            locale={{ emptyText: 'No payment records found.' }}
          />
        </Card>
      </Space>
    </div>
  );
}