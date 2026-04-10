import { DashboardLayout } from "@/components/DashboardLayout";
import { DemandChart } from "@/components/DemandChart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getInventory } from "@/services/api";

const COLORS = [
  "#00b894",
  "#0984e3",
  "#d63031",
  "#fdcb6e",
  "#6c5ce7",
  "#00cec9",
  "#e17055",
  "#636e72",
];

const AnalyticsPage = () => {

  const role = localStorage.getItem("role");

  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {

    if (role !== "ADMIN") return;

    loadInventory();

  }, []);

  async function loadInventory() {

    try {

      const data = await getInventory();

      setInventory(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error("Analytics inventory load error", err);

    }

  }

  /* ---------------- DATA PREP ---------------- */

  const pieData = inventory.map(i => ({
    name: i.blood_group,
    value: i.units
  }));

  const totalUnits = inventory.reduce(
    (s, i) => s + (i.units || 0),
    0
  );

  const lowStock = inventory.filter(
    i => (i.units || 0) < 20
  ).length;

  const trendData = inventory.map((i, index) => ({
    day: `Day ${index + 1}`,
    units: i.units
  }));

  /* ---------------- UI ---------------- */

  return (

    <DashboardLayout>

      <div className="space-y-6">

        <div>

          <h1 className="text-2xl font-bold text-foreground">
            Analytics
          </h1>

          <p className="text-sm text-muted-foreground">
            Blood bank performance metrics
          </p>

        </div>

        {/* SUMMARY METRICS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-card border rounded-xl p-4">
            <p className="text-xs text-muted-foreground">
              Total Blood Units
            </p>
            <p className="text-xl font-bold">
              {totalUnits}
            </p>
          </div>

          <div className="bg-card border rounded-xl p-4">
            <p className="text-xs text-muted-foreground">
              Blood Groups
            </p>
            <p className="text-xl font-bold">
              {inventory.length}
            </p>
          </div>

          <div className="bg-card border rounded-xl p-4">
            <p className="text-xs text-muted-foreground">
              Low Stock Alerts
            </p>
            <p className="text-xl font-bold text-destructive">
              {lowStock}
            </p>
          </div>

        </div>

        {/* CHART GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* AI DEMAND CHART */}

          <DemandChart />

          {/* INVENTORY DISTRIBUTION */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl border p-5"
          >

            <h3 className="text-sm font-semibold mb-2">
              Inventory Distribution
            </h3>

            <ResponsiveContainer width="100%" height={280}>

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >

                  {pieData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </motion.div>

          {/* INVENTORY TREND */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl border p-5"
          >

            <h3 className="text-sm font-semibold mb-2">
              Inventory Trend
            </h3>

            <ResponsiveContainer width="100%" height={280}>

              <LineChart data={trendData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="day" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="units"
                  stroke="#00b894"
                  strokeWidth={2}
                />

              </LineChart>

            </ResponsiveContainer>

          </motion.div>

          {/* AI SHORTAGE PREDICTION */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl border p-5"
          >

            <h3 className="text-sm font-semibold mb-2">
              AI Shortage Prediction
            </h3>

            <p className="text-xs text-muted-foreground">

              Based on current inventory trends,  
              {lowStock > 0
                ? " some blood groups may experience shortages soon."
                : " inventory levels are currently stable."}

            </p>

          </motion.div>

        </div>

      </div>

    </DashboardLayout>

  );

};

export default AnalyticsPage;