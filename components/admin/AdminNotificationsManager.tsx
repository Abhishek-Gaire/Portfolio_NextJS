"use client";

import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";

type ContactMessage = {
  id: string | number;
  name?: string;
  email?: string;
  message?: string;
  created_at?: string;
};

type AdminNotificationsManagerProps = {
  initialContacts?: ContactMessage[];
};

export default function AdminNotificationsManager({
  initialContacts = [],
}: AdminNotificationsManagerProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [contacts, setContacts] = useState<ContactMessage[]>(initialContacts);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async (id: string | number) => {
    setErrorMessage("");
    const { error } = await supabase.from("Contacts").delete().eq("id", id);

    if (error) {
      setErrorMessage(error.message || "Unable to delete contact.");
      return;
    }

    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-sm text-slate-500">
          Review and manage contact submissions.
        </p>
      </div>

      {errorMessage && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {contacts.length === 0 ? (
        <p className="text-sm text-slate-500">No contact submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {contact.name || "Anonymous"}
                </p>
                <p className="text-xs text-slate-500">{contact.email}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {contact.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(contact.id)}
                className="inline-flex items-center self-start rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 md:self-center"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
