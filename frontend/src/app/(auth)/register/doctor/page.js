import { redirect } from "next/navigation";

export default function LegacyDoctorRegisterRedirect() {
  redirect("/admin/registerDoctor");
}
