"use client";

import { Button } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import styles from "./telemedicine-cards.module.css";

dayjs.extend(relativeTime);

const tmStatusLabels = {
  pending: "Request pending",
  accepted: "Approved / scheduled",
  rejected: "Rejected",
  cancelled: "Cancelled",
  completed: "Completed",
};

export default function PatientTmRequestCard({
  req,
  cancelingTmId,
  onCancelRequest,
}) {
  const id = req.id || req._id;
  const status = req.status || "pending";

  return (
    <div className={`${styles.card} ${styles.cardPatient}`} data-status={status}>
      <aside className={styles.rail} aria-hidden>
        <div className={styles.railGlyph}>
          <VideoCameraOutlined />
        </div>
        <span className={styles.railCode}>TM</span>
        <div className={styles.railDot} />
      </aside>

      <div className={styles.body}>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Telemedicine request</p>
            <h3 className={styles.title}>
              Dr. {req.doctor?.fullName || "Assigned physician"}
            </h3>
            <p className={styles.subtitle}>
              {req.doctor?.specialty || "Specialty not listed"}
            </p>
          </div>
          <div className={styles.badgeRow}>
            <span className={`${styles.pill} ${styles.pillType}`}>
              <VideoCameraOutlined />
              Session
            </span>
            <span className={`${styles.pill} ${styles.pillStatus}`}>
              {tmStatusLabels[status] || status}
            </span>
          </div>
        </header>

        <div className={styles.cardInner}>
          <div className={styles.detailBlock}>
            <div className={styles.detailInset}>
              {req.scheduledAt ? (
                <div className={styles.scheduleHighlight}>
                  <span className={styles.scheduleChip}>
                    <CalendarOutlined />
                    {dayjs(req.scheduledAt).format("ddd, MMM D, YYYY")}
                  </span>
                  <span className={styles.scheduleChip}>
                    <ClockCircleOutlined />
                    {dayjs(req.scheduledAt).format("HH:mm")}
                  </span>
                </div>
              ) : (
                <div className={styles.waitingBanner}>
                  Awaiting schedule — your doctor will set date and time after
                  review.
                </div>
              )}

              <div className={styles.detailGrid} style={{ marginTop: 10 }}>
                <span className={styles.detailLabel}>Clinical reason</span>
                <span className={styles.detailValue}>{req.reason || "—"}</span>
                {req.notes ? (
                  <>
                    <span className={styles.detailLabel}>Your notes</span>
                    <span className={styles.detailValueMuted}>{req.notes}</span>
                  </>
                ) : null}
              </div>
            </div>

            {req.meetingLink && req.isMeetingLinkVisible ? (
              <div style={{ marginTop: 10 }}>
                <Button
                  type="primary"
                  className={styles.meetBtn}
                  href={req.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<VideoCameraOutlined />}
                >
                  Join secure session
                </Button>
              </div>
            ) : req.status === "accepted" && req.scheduledAt ? (
              <p className={styles.linkHint} style={{ marginTop: 8 }}>
                Your meeting link unlocks within two days of the scheduled start.
              </p>
            ) : null}
          </div>

          <footer className={styles.foot}>
            <span className={styles.refId}>
              REF-{String(id).slice(-8).toUpperCase()} · Submitted{" "}
              {req.createdAt ? dayjs(req.createdAt).fromNow() : "—"}
            </span>
            {status === "pending" && (
              <Button
                danger
                loading={cancelingTmId === id}
                onClick={() => onCancelRequest(id)}
                size="small"
                style={{
                  borderRadius: 8,
                  fontWeight: 600,
                  minWidth: 120,
                  height: 32,
                  fontSize: 12,
                }}
              >
                Cancel request
              </Button>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
}
