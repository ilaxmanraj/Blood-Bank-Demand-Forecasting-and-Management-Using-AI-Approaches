import { useEffect, useState } from "react";
import { AlertTriangle, AlertCircle, Clock } from "lucide-react";
import { getInventory, getRequests, getAlerts } from "@/services/api";

const typeIcons: any = {
  emergency: AlertTriangle,
  shortage: AlertCircle,
  info: Clock,
};

const typeColors: any = {
  emergency: "text-destructive bg-destructive/10",
  shortage: "text-warning bg-warning/10",
  info: "text-info bg-info/10",
};

export function NotificationFeed() {

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 15000); // 🔁 auto refresh

    return () => clearInterval(interval);

  }, []);

  async function loadNotifications() {

    try {

      const [inventory, requests, alertsData] = await Promise.all([
        getInventory(),
        getRequests(),
        getAlerts()   // ✅ NEW
      ]);

      const alerts: any[] = [];

      /* 🔴 EXPIRY ALERTS (NEW) */

      alertsData.forEach((a: any) => {

        alerts.push({
          id: `expiry-${a.id}`,
          type: a.status === "EXPIRED" ? "emergency" : "shortage",
          message: a.message,
          timestamp: a.created_at || new Date().toISOString()
        });

      });

      /* Low Inventory Alerts */

      inventory.forEach((i: any) => {

        if (i.units < 20) {

          alerts.push({
            id: `stock-${i.blood_group}`,
            type: "shortage",
            message: `${i.blood_group} stock is low (${i.units} units remaining)`,
            timestamp: new Date().toISOString()
          });

        }

      });

      /* Pending Requests */

      requests.forEach((r: any) => {

        if (r.status === "PENDING") {

          alerts.push({
            id: `req-${r.id}`,
            type: "emergency",
            message: `Pending request: ${r.units_required} units of ${r.blood_group}`,
            timestamp: new Date().toISOString()
          });

        }

      });

      // 🔥 SORT latest first
      alerts.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setNotifications(alerts);

    } catch (err) {

      console.error("Notification load error", err);

    }

  }

  return (

    <div className="bg-card rounded-xl border">

      <div className="p-5 border-b">

        <h3 className="text-sm font-semibold">
          🔔 Notifications
        </h3>

        <p className="text-xs text-muted-foreground">
          System generated alerts
        </p>

      </div>

      <div className="divide-y max-h-80 overflow-y-auto">

        {notifications.length === 0 && (
          <p className="p-5 text-xs text-muted-foreground">
            No alerts
          </p>
        )}

        {notifications.map((n) => {

          const TypeIcon = typeIcons[n.type];

          return (

            <div
              key={n.id}
              className="px-5 py-3 flex gap-3 hover:bg-muted/30"
            >

              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColors[n.type]}`}>

                <TypeIcon className="h-4 w-4" />

              </div>

              <div className="flex-1">

                <p className="text-xs font-semibold">
                  {n.message}
                </p>

                <span className="text-[10px] text-muted-foreground">
                  {new Date(n.timestamp).toLocaleTimeString()}
                </span>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}