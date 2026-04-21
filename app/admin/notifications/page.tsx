import type { Metadata } from "next";
import AdminNotificationsManager from "../../../components/admin/AdminNotificationsManager";
import { getSupabaseServerAuthClient } from "../../../lib/supabase/server-auth";

export const metadata: Metadata = {
  title: "Admin Notifications",
  description: "Manage contact and system notifications from the admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

type ContactMessage = {
  id: string | number;
  name?: string;
  email?: string;
  message?: string;
  created_at?: string;
};

export default async function AdminNotificationsPage() {
  const supabase = await getSupabaseServerAuthClient();
  const { data, error } = await supabase
    .from("Contacts")
    .select("*")
    .order("created_at", { ascending: false });

  const contacts = error ? [] : ((data ?? []) as ContactMessage[]);

  return <AdminNotificationsManager initialContacts={contacts} />;
}
