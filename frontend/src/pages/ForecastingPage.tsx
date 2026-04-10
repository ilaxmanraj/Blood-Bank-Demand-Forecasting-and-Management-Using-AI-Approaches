import { DashboardLayout } from "@/components/DashboardLayout";
import { ForecastTable } from "@/components/ForecastTable";
import { DemandChart } from "@/components/DemandChart";
import { BrainCircuit, Zap, Target, Shield } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";
import { getInventory, predictDemand } from "@/services/api";

const ForecastingPage = () => {

  const [inventory, setInventory] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<number>(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    try {

      const inv = await getInventory();
      const pred = await predictDemand(1);

      setInventory(Array.isArray(inv) ? inv : []);
      setPrediction(pred?.predicted_demand || 0);

    } catch (err) {

      console.error("Forecast load error", err);
      setInventory([]);
      setPrediction(0);

    }

  }

  const radarData = inventory.map((i: any) => ({
    bloodGroup: i.blood_group,
    supply: i.units || 0,
    demand: prediction
  }));

  const totalUnits = inventory.reduce(
    (s: number, i: any) => s + (i.units || 0),
    0
  );

  const shortageRisk = inventory.filter(
    (i: any) => (i.units || 0) < 20
  ).length;

  return (

    <DashboardLayout>

      <div className="space-y-6">

        <div>

          <h1 className="text-2xl font-bold text-foreground">
            AI Demand Forecasting
          </h1>

          <p className="text-sm text-muted-foreground">
            AI predicted blood demand
          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <StatCard
            title="Predicted Demand"
            value={prediction}
            icon={Target}
          />

          <StatCard
            title="Blood Types"
            value={inventory.length}
            icon={BrainCircuit}
            delay={0.1}
          />

          <StatCard
            title="Inventory Units"
            value={totalUnits}
            icon={Zap}
            delay={0.2}
          />

          <StatCard
            title="Shortage Risk"
            value={shortageRisk}
            icon={Shield}
            delay={0.3}
          />

        </div>

        {/* AI INSIGHT */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent/50 border rounded-xl p-5"
        >

          <div className="flex gap-3">

            <BrainCircuit className="h-5 w-5 text-primary" />

            <div>

              <p className="text-sm font-semibold">
                AI Insight
              </p>

              <p className="text-xs text-muted-foreground">
                Current predicted demand is {prediction} units.
                Monitor inventory for shortages.
              </p>

            </div>

          </div>

        </motion.div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <DemandChart />

          <div className="bg-card rounded-xl border p-5">

            <h3 className="text-sm font-semibold mb-2">
              Supply vs Demand Radar
            </h3>

            <ResponsiveContainer width="100%" height={280}>

              <RadarChart data={radarData}>

                <PolarGrid />

                <PolarAngleAxis dataKey="bloodGroup" />

                <PolarRadiusAxis />

                <Radar
                  name="Supply"
                  dataKey="supply"
                  stroke="#00b894"
                  fill="#00b894"
                  fillOpacity={0.3}
                />

                <Radar
                  name="Demand"
                  dataKey="demand"
                  stroke="#d63031"
                  fill="#d63031"
                  fillOpacity={0.2}
                />

              </RadarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* TABLE */}

        <ForecastTable />

      </div>

    </DashboardLayout>

  );

};

export default ForecastingPage;