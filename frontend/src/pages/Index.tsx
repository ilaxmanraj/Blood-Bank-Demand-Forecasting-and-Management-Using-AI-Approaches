import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { BloodInventoryGrid } from "@/components/BloodInventoryGrid";
import { DemandChart } from "@/components/DemandChart";
import { ForecastTable } from "@/components/ForecastTable";
import { RecentRequests } from "@/components/RecentRequests";
import { NotificationFeed } from "@/components/NotificationFeed";

import {
  Droplets,
  Users,
  Activity,
  AlertTriangle,
  BrainCircuit
} from "lucide-react";

import {
  getInventory,
  getDonors,
  getRequests,
  getAlerts   // ✅ NEW
} from "@/services/api";

const Index = () => {

  const role = localStorage.getItem("role");

  const [inventory, setInventory] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]); // ✅ NEW

  useEffect(() => {

    loadData();
    loadAlerts(); // ✅ NEW

    const interval = setInterval(() => {
      loadData();
      loadAlerts(); // ✅ NEW (auto refresh)
    }, 30000);

    return () => clearInterval(interval);

  }, []);

  async function loadData() {

    try {

      let inv: any[] = [];
      let dns: any[] = [];
      let req: any[] = [];

      if (role === "ADMIN") {

        [inv, dns, req] = await Promise.all([
          getInventory(),
          getDonors(),
          getRequests()
        ]);

      }

      else if (role === "HOSPITAL") {

        [inv, req] = await Promise.all([
          getInventory(),
          getRequests()
        ]);

      }

      else if (role === "DONOR") {

        inv = await getInventory();

      }

      setInventory(Array.isArray(inv) ? inv : []);
      setDonors(Array.isArray(dns) ? dns : []);
      setRequests(Array.isArray(req) ? req : []);

    } catch (error) {

      console.error("Dashboard load error:", error);

    }

  }

  // ✅ NEW FUNCTION
  async function loadAlerts() {
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error("Alerts load error:", err);
    }
  }

  const totalUnits = inventory.reduce((sum, i) => sum + (i.units || 0), 0);
  const criticalGroups = inventory.filter(i => (i.units || 0) < 10).length;
  const activeDonors = donors.length;
  const pendingRequests = requests.filter(r => r.status === "PENDING").length;

  return (

    <DashboardLayout>

      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            AI-driven blood bank demand forecasting overview
          </p>
        </div>

        {/* 🔥 EXPIRY ALERTS UI (NEW) */}

        {alerts.length > 0 && (

          <div className="space-y-3">

            <h2 className="text-sm font-semibold">⚠️ Expiry Alerts</h2>

            {alerts.slice(0, 5).map((alert) => (

              <div
                key={alert.id}
                className={`p-4 rounded-xl text-white shadow ${
                  alert.status === "EXPIRED"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              >
                <p className="font-semibold">{alert.message}</p>
                <p className="text-xs">
                  Blood Group: {alert.blood_group}
                </p>
              </div>

            ))}

          </div>

        )}

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <StatCard
            title="Total Blood Units"
            value={totalUnits}
            change="Live inventory"
            changeType="positive"
            icon={Droplets}
          />

          {role === "ADMIN" && (

            <StatCard
              title="Active Donors"
              value={activeDonors}
              change="Registered donors"
              changeType="neutral"
              icon={Users}
            />

          )}

          {(role === "ADMIN" || role === "HOSPITAL") && (

            <StatCard
              title="Pending Requests"
              value={pendingRequests}
              change="Hospital requests"
              changeType="negative"
              icon={Activity}
            />

          )}

          <StatCard
            title="Critical Shortages"
            value={criticalGroups}
            change="Below safe level"
            changeType="negative"
            icon={AlertTriangle}
          />

        </div>

        {/* SHORTAGE ALERT */}

        {criticalGroups > 0 && (

          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex gap-3">

            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <BrainCircuit className="h-4 w-4 text-destructive" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                AI Shortage Alert
              </p>

              <p className="text-xs text-muted-foreground">
                Some blood groups are reaching critical levels.
                Please initiate donor notifications.
              </p>
            </div>

          </div>

        )}

        {/* INVENTORY */}

        <div>
          <h2 className="text-sm font-semibold mb-3">
            Blood Inventory Status
          </h2>

          <BloodInventoryGrid />
        </div>

        {/* AI FORECAST */}

        {role === "ADMIN" && (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DemandChart />
            <ForecastTable />
          </div>

        )}

        {/* REQUESTS + NOTIFICATIONS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {(role === "ADMIN" || role === "HOSPITAL") && (
            <RecentRequests />
          )}

          <NotificationFeed />

        </div>

      </div>

    </DashboardLayout>

  );

};

export default Index;