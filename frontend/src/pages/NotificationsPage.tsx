import { DashboardLayout } from "@/components/DashboardLayout";
import { AlertTriangle, AlertCircle, Clock, Bell } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getInventory, getRequests } from "@/services/api";

const NotificationsPage = () => {

  const role = localStorage.getItem("role");

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {

    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);

  }, []);

  async function loadNotifications() {

    try {

      const inventory = await getInventory();
      const requests = await getRequests();

      const safeInventory = Array.isArray(inventory) ? inventory : [];
      const safeRequests = Array.isArray(requests) ? requests : [];

      const alerts: any[] = [];

      /* ---------------- LOW STOCK ALERT ---------------- */

      safeInventory.forEach((i:any) => {

        if ((i.units || 0) < 20) {

          alerts.push({
            id: `stock-${i.blood_group}`,
            type: "shortage",
            message: `Low stock: ${i.blood_group} has only ${i.units} units left.`,
            time: new Date().toISOString()
          });

        }

      });

      /* ---------------- BLOOD EXPIRY ALERT ---------------- */

      safeInventory.forEach((i:any) => {

        if (!i.expiry_date) return;

        const expiry = new Date(i.expiry_date).getTime();
        const now = new Date().getTime();

        const days = (expiry - now) / (1000 * 60 * 60 * 24);

        if (days < 3) {

          alerts.push({
            id: `expiry-${i.id}`,
            type: "expiry",
            message: `${i.blood_group} blood units expiring soon.`,
            time: new Date().toISOString()
          });

        }

      });

      /* ---------------- REQUEST ALERTS ---------------- */

      safeRequests.forEach((r:any) => {

        if (r.status === "PENDING" && role === "ADMIN") {

          alerts.push({
            id: `req-${r.id}`,
            type: "request",
            message: `Pending request: ${r.units_required} units of ${r.blood_group} for ${r.hospital}.`,
            time: new Date().toISOString()
          });

        }

        if (r.status === "APPROVED" && role === "HOSPITAL") {

          alerts.push({
            id: `approved-${r.id}`,
            type: "approval",
            message: `Your request for ${r.blood_group} has been approved.`,
            time: new Date().toISOString()
          });

        }

      });

      /* ---------------- SORT NEWEST FIRST ---------------- */

      alerts.sort(
        (a,b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );

      setNotifications(alerts);

    } catch (err) {

      console.error("Notification load error", err);
      setNotifications([]);

    }

  }

  const unread = notifications.length;

  const lowStock = notifications.filter(
    n => n.type === "shortage"
  ).length;

  const pendingReq = notifications.filter(
    n => n.type === "request"
  ).length;

  const expiryAlerts = notifications.filter(
    n => n.type === "expiry"
  ).length;

  return (

    <DashboardLayout>

      <div className="space-y-6">

        <div>

          <h1 className="text-2xl font-bold">
            Notifications
          </h1>

          <p className="text-sm text-muted-foreground">
            System alerts and warnings
          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <StatCard
            title="Total Alerts"
            value={notifications.length}
            icon={Bell}
          />

          <StatCard
            title="Low Stock"
            value={lowStock}
            icon={AlertCircle}
            changeType="negative"
          />

          <StatCard
            title="Pending Requests"
            value={pendingReq}
            icon={Clock}
          />

          <StatCard
            title="Expiry Alerts"
            value={expiryAlerts}
            icon={AlertTriangle}
          />

        </div>

        {/* ALERT LIST */}

        <div className="space-y-3">

          {notifications.length === 0 && (

            <div className="text-sm text-muted-foreground">
              No alerts right now.
            </div>

          )}

          {notifications.map((n:any, i:number) => (

            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border p-5"
            >

              <p className="text-sm font-semibold">
                {n.message}
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                {new Date(n.time).toLocaleString()}
              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </DashboardLayout>

  );

};

export default NotificationsPage;