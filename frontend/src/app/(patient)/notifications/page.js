"use client";
import React, { useEffect, useState } from "react";
import { patientAPI } from "@/services/patient.service";
import { getSessionValue } from "@/utils/session";
import NotificationCard from "@/components/shared/NotificationCard";
import { usePatient } from "@/context/PatientProvider";
import { Inbox } from "lucide-react";

export default function NotificationsPage() {
  const { getNotifications, notifications } = usePatient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        await getNotifications();
      } catch (e) {
        setError("Failed to load notifications");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Empty state */}
      {!loading && (!notifications || notifications.length === 0) && (
        <div className="py-12 flex flex-col items-center text-center text-gray-500">
          <Inbox className="h-12 w-12 text-gray-300" />
          <p className="mt-4 text-lg font-medium">No notifications</p>
          <p className="mt-1 text-sm">
            You're all caught up — no new notifications.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {notifications?.map((n) => (
          <NotificationCard key={n._id} notification={n} />
        ))}
      </div>
    </div>
  );
}
