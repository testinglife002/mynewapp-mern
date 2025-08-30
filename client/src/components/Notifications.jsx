import { useEffect, useState } from "react";

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:5000/api/notifications/stream");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifs((prev) => [data, ...prev]); // prepend new
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h3>🔔 Notifications</h3>
      <ul>
        {notifs.map((n, idx) => (
          <li key={idx}>{n.message}</li>
        ))}
      </ul>
    </div>
  );
}
