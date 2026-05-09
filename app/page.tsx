import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth";

export default async function HomePage() {
  const { profile } = await getCurrentProfile();

  if (profile?.role === "mother") {
    redirect("/mother");
  }

  if (profile?.role === "child") {
    redirect("/child");
  }

  redirect("/login");
}
