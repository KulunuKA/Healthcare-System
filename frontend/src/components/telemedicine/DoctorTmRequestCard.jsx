"use client";

import { Button, Typography } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  MailOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import styles from "./telemedicine-cards.module.css";

const { Text } = Typography;

export default function DoctorTmRequestCard({
  req,
  onReview,
  onReject,
}) {
  const status = req.status || "pending";
  const initial =
    (req.patient?.displayName || req.patient?.email || "?")
      .trim()
      .charAt(0)
      .toUpperCase() || "?";

  return (
    <div className={styles.card} data-status={status}>
      <aside className={styles.rail} aria-hidden>
        <div className={styles.railGlyph}>
          <span style={{ fontSize: 15, fontWeight: 800 }}>{initial}</span>
        </div>
        <span className={styles.railCode}>Inbox</span>
        <div className={styles.railDot} />
      </aside>

      <div className={styles.body}>
        <div className={styles.doctorSheet}>
          <div className={styles.doctorMain}>
            <p className={styles.eyebrow} style={{ marginBottom: 8 }}>
              Incoming request
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "8px 12px",
                marginBottom: 12,
              }}
            >
              <Text strong style={{ fontSize: 17, color: "#0f172a" }}>
                <UserOutlined style={{ marginRight: 8, color: "#6366f1" }} />
                {req.patient?.displayName ||
                  req.patient?.email ||
                  "Patient"}
              </Text>
              <span className={`${styles.pill} ${styles.pillStatus}`}>
                {status}
              </span>
              {status === "pending" && (
                <span className={`${styles.pill} ${styles.pillType}`}>
                  Action required
                </span>
              )}
              {status === "accepted" && (
                <span
                  className={`${styles.pill} ${
                    req.paid ? styles.pillPaid : styles.pillUnpaid
                  }`}
                >
                  {req.paid ? "Paid" : "Awaiting payment"}
                </span>
              )}
            </div>
            {req.patient?.email ? (
              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: 13,
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <MailOutlined />
                {req.patient.email}
              </p>
            ) : null}

            <div className={styles.detailInset}>
              <div className={styles.detailGrid}>
                <span className={styles.detailLabel}>Reason</span>
                <span className={styles.detailValue}>{req.reason || "—"}</span>
                {req.notes ? (
                  <>
                    <span className={styles.detailLabel}>Patient notes</span>
                    <span className={styles.detailValueMuted}>{req.notes}</span>
                  </>
                ) : null}
                {req.scheduledAt ? (
                  <>
                    <span className={styles.detailLabel}>Scheduled</span>
                    <span className={styles.detailValue}>
                      {dayjs(req.scheduledAt).format("MMM D, YYYY · HH:mm")}
                    </span>
                  </>
                ) : null}
                {req.meetingLink ? (
                  <>
                    <span className={styles.detailLabel}>Meeting</span>
                    <Text
                      copyable={{ text: req.meetingLink }}
                      className={styles.copyLink}
                    >
                      {req.meetingLink}
                    </Text>
                  </>
                ) : null}
                <span className={styles.detailLabel}>Request ID</span>
                <span className={`${styles.detailValue} ${styles.refId}`}>
                  {req.id}
                </span>
              </div>
            </div>
          </div>

          {status === "pending" && (
            <div className={styles.doctorActions}>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                className={styles.actionPrimary}
                onClick={() => onReview(req)}
              >
                Review &amp; accept
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                className={styles.actionDanger}
                onClick={() => onReject(req)}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
