import React from "react";
import { EmailNotificationsSettings } from "../components/FormEmail";
import { useEmailAccount } from "../hooks/useEmailAccount";

export default function EmailNotificationsPage() {
  const emailAccount = useEmailAccount();

  return (
    <main style={{ minHeight: "100vh", padding: 0 }}>
      <EmailNotificationsSettings {...emailAccount} />
    </main>
  );
}