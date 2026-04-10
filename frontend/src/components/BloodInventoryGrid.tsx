import { motion } from "framer-motion";
import { Droplets, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { getInventory } from "@/services/api";

function getStockLevel(units: number) {

  if (units < 20) {
    return {
      label: "Critical",
      color: "bg-destructive/10 text-destructive border-destructive/20",
    };
  }

  if (units < 50) {
    return {
      label: "Low",
      color: "bg-warning/10 text-warning border-warning/20",
    };
  }

  return {
    label: "Adequate",
    color: "bg-success/10 text-success border-success/20",
  };
}

export function BloodInventoryGrid() {

  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchInventory() {

      try {

        const data = await getInventory();

        if (Array.isArray(data)) {
          setInventory(data);
        } else {
          setInventory([]);
        }

      } catch (error) {

        console.error("Inventory fetch error:", error);
        setInventory([]);

      } finally {

        setLoading(false);

      }

    }

    fetchInventory();

  }, []);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading inventory...
      </p>
    );
  }

  if (inventory.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No inventory data available
      </p>
    );
  }

  return (

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

      {inventory.map((item:any, i:number) => {

        const units = item.units || 0;
        const stock = getStockLevel(units);

        return (

          <motion.div
            key={item.id || i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="bg-card rounded-xl border p-4 space-y-3"
          >

            <div className="flex items-center justify-between">

              <span className="text-lg font-bold font-mono">
                {item.blood_group}
              </span>

              {units < 20 && (
                <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
              )}

            </div>

            <div className="flex items-end gap-1">

              <span className="text-3xl font-extrabold">
                {units}
              </span>

              <span className="text-xs text-muted-foreground mb-1">
                units
              </span>

            </div>

            <span
              className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border ${stock.color}`}
            >
              {stock.label}
            </span>

            {item.expiry_date && (

              <p className="text-[10px] text-muted-foreground flex items-center gap-1">

                <Droplets className="h-3 w-3" />

                Expiry: {item.expiry_date}

              </p>

            )}

          </motion.div>

        );

      })}

    </div>

  );

}