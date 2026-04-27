import React from "react";
import { EmailNotificationsSettings } from "../components/FormEmail";

export default function EmailNotificationsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 0,
      }}
    >
      <EmailNotificationsSettings />
    </main>
  );
}