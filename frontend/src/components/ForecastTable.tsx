import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { predictDemand } from "@/services/api";

const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export function ForecastTable() {

  const [forecasts, setForecasts] = useState<any[]>([]);

  useEffect(() => {
    loadForecast();
  }, []);

  async function loadForecast() {

    try {

      const result = await Promise.all(
        bloodGroups.map(async (group) => {

          const p24 = await predictDemand(1);
          const p48 = await predictDemand(2);
          const p72 = await predictDemand(3);

          return {
            bloodGroup: group,
            predicted24h: Math.round(p24.predicted_demand),
            predicted48h: Math.round(p48.predicted_demand),
            predicted72h: Math.round(p72.predicted_demand),
            confidence: 0.9,
            trend: "up"
          };

        })
      );

      setForecasts(result);

    } catch (error) {

      console.error("Forecast error:", error);

    }
  }

  return (
    <div className="bg-card rounded-xl border overflow-hidden">

      <div className="p-5 border-b">

        <h3 className="text-sm font-semibold">
          AI Demand Forecast
        </h3>

        <p className="text-xs text-muted-foreground">
          AI predicted blood demand
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>

            <tr className="bg-muted/50">

              <th className="text-left px-4 py-3 text-[10px] uppercase">
                Blood Group
              </th>

              <th className="text-right px-4 py-3 text-[10px] uppercase">
                24h
              </th>

              <th className="text-right px-4 py-3 text-[10px] uppercase">
                48h
              </th>

              <th className="text-right px-4 py-3 text-[10px] uppercase">
                72h
              </th>

              <th className="text-right px-4 py-3 text-[10px] uppercase">
                Confidence
              </th>

              <th className="text-center px-4 py-3 text-[10px] uppercase">
                Trend
              </th>

            </tr>

          </thead>

          <tbody>

            {forecasts.map((f, i) => (

              <motion.tr
                key={f.bloodGroup}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-t hover:bg-muted/30"
              >

                <td className="px-4 py-3 font-mono font-bold">
                  {f.bloodGroup}
                </td>

                <td className="px-4 py-3 text-right font-mono">
                  {f.predicted24h}
                </td>

                <td className="px-4 py-3 text-right font-mono">
                  {f.predicted48h}
                </td>

                <td className="px-4 py-3 text-right font-mono">
                  {f.predicted72h}
                </td>

                <td className="px-4 py-3 text-right">
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                    {(f.confidence * 100).toFixed(0)}%
                  </span>
                </td>

                <td className="px-4 py-3 text-center">

                  {f.trend === "up" && (
                    <TrendingUp className="h-4 w-4 text-destructive inline" />
                  )}

                  {f.trend === "down" && (
                    <TrendingDown className="h-4 w-4 text-success inline" />
                  )}

                  {f.trend === "stable" && (
                    <Minus className="h-4 w-4 text-muted-foreground inline" />
                  )}

                </td>

              </motion.tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}