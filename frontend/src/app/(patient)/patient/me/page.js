"use client";
import { useAuth } from "@/context/AuthProvider";
import React, { useEffect, useState } from "react";
import { usePatient } from "@/context/PatientProvider";
import { message } from "antd";
import { Input, Button } from '@/components/ui';

export default function MePage() {
  const { user } = useAuth();
  const {
    profile,
    setProfile,
    loading,
    saving,
    getPatientProfile,
    updatePatientProfile,
  } = usePatient();
  const [localProfile, setLocalProfile] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        await getPatientProfile();
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const onSave = async () => {
    try {
      await updatePatientProfile(localProfile);
      message.success("Profile updated successfully");
    } catch (e) {
      console.error(e);
      message.error("Failed to update profile");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My profile</h1>
      {!localProfile && <div className="text-gray-600">No profile loaded</div>}
      {localProfile && (
        <div className="space-y-4 bg-white p-6 rounded shadow">
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <div className="text-sm font-medium text-gray-700">Full name</div>
              <Input
                className="mt-1"
                value={localProfile.fullName || ""}
                onChange={(v) => setLocalProfile({ ...localProfile, fullName: v })}
                label={null}
                placeholder="Full name"
              />
            </label>

            <label className="block">
              <div className="text-sm font-medium text-gray-700">Phone</div>
              <Input
                className="mt-1"
                value={localProfile.phone || ""}
                onChange={(v) => setLocalProfile({ ...localProfile, phone: v })}
                label={null}
                placeholder="Phone"
              />
            </label>

            <label className="block">
              <div className="text-sm font-medium text-gray-700">Gender</div>
              <select
                className="mt-1 block w-full border rounded px-3 py-2 bg-white"
                value={localProfile.gender || ""}
                onChange={(e) => setLocalProfile({ ...localProfile, gender: e.target.value })}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </label>

            <div className="mt-2">
              <div className="text-sm font-semibold">Address</div>
              <div className="grid grid-cols-1 gap-3 mt-2">
                <Input
                  placeholder="Street"
                  className="block w-full"
                  value={localProfile.address?.street || ""}
                  onChange={(v) =>
                    setLocalProfile({
                      ...localProfile,
                      address: {
                        ...(localProfile.address || {}),
                        street: v,
                      },
                    })
                  }
                />
                <Input
                  placeholder="City"
                  className="block w-full"
                  value={localProfile.address?.city || ""}
                  onChange={(v) =>
                    setLocalProfile({
                      ...localProfile,
                      address: {
                        ...(localProfile.address || {}),
                        city: v,
                      },
                    })
                  }
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="State"
                    className="flex-1"
                    value={localProfile.address?.state || ""}
                    onChange={(v) =>
                      setLocalProfile({
                        ...localProfile,
                        address: {
                          ...(localProfile.address || {}),
                          state: v,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Zip"
                    className="w-28"
                    value={localProfile.address?.zip || ""}
                    onChange={(v) =>
                      setLocalProfile({
                        ...localProfile,
                        address: {
                          ...(localProfile.address || {}),
                          zip: v,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={onSave} loading={saving}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
