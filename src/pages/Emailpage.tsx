import React from "react";
import { TeamsNotificationsSettings } from "../components/FormTeams";
import { useNotificationConfig } from "../hooks/useNotificationConfig";

export default function TeamsNotificationsPage() {
  const config = useNotificationConfig();

  return (
    <main style={{ minHeight: "100vh", padding: 0 }}>
      <TeamsNotificationsSettings
        {...config}
        availableEvents={config.availableEvents}
        testing={config.testing}
        sendTest={config.sendTest}
      />
    </main>
  );
}
