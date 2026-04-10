import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import { predictDemand } from "@/services/api";

const BLOOD_COLORS: Record<string, string> = {
  "A+": "#00b894",
  "A-": "#00cec9",
  "B+": "#d63031",
  "B-": "#e17055",
  "O+": "#0984e3",
  "O-": "#6c5ce7",
  "AB+": "#fdcb6e",
  "AB-": "#636e72"
};

export function DemandChart() {

  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChart();
  }, []);

  async function loadChart() {

    try {

      const days = Array.from({ length: 7 }, (_, i) => i + 1);

      /* RUN API CALLS IN PARALLEL */

      const predictions = await Promise.all(
        days.map(day => predictDemand(day))
      );

      const data = predictions.map((prediction, index) => {

        const base = prediction?.predicted_demand || 0;

        return {
          date: `Day-${index + 1}`,
          "A+": Math.round(base * 0.22),
          "A-": Math.round(base * 0.05),
          "B+": Math.round(base * 0.20),
          "B-": Math.round(base * 0.05),
          "O+": Math.round(base * 0.30),
          "O-": Math.round(base * 0.08),
          "AB+": Math.round(base * 0.07),
          "AB-": Math.round(base * 0.03)
        };

      });

      setChartData(data);

    } catch (error) {

      console.error("Chart load error:", error);

      /* FALLBACK DATA */

      setChartData([
        { date: "Day-1", "A+": 12, "B+": 9, "O+": 15, "AB+": 5 },
        { date: "Day-2", "A+": 15, "B+": 10, "O+": 18, "AB+": 6 },
        { date: "Day-3", "A+": 13, "B+": 11, "O+": 17, "AB+": 7 }
      ]);

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="bg-card rounded-xl border p-5">

      <div className="mb-4">

        <h3 className="text-sm font-semibold">
          AI Blood Demand Forecast
        </h3>

        <p className="text-xs text-muted-foreground">
          Predicted blood demand for upcoming days
        </p>

      </div>

      {loading && (
        <p className="text-xs text-muted-foreground">
          Loading AI prediction...
        </p>
      )}

      <ResponsiveContainer width="100%" height={280}>

        <AreaChart data={chartData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Legend />

          {Object.entries(BLOOD_COLORS).map(([group, color]) => (

            <Area
              key={group}
              type="monotone"
              dataKey={group}
              stroke={color}
              fillOpacity={0.15}
              fill={color}
            />

          ))}

        </AreaChart>

      </ResponsiveContainer>

    </div>

  );

}