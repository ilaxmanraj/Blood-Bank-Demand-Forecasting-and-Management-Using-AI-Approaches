import { DashboardLayout } from "@/components/DashboardLayout";
import { BloodInventoryGrid } from "@/components/BloodInventoryGrid";
import { Package, AlertTriangle, Clock, TrendingUp, Plus } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useEffect, useState } from "react";
import { getInventory } from "@/services/api";

const API_URL = "http://127.0.0.1:8000";

type InventoryItem = {
  id: number;
  blood_group: string;
  units: number;
  expiry_date?: string;
};

type InventoryForm = {
  blood_group: string;
  units: string;
  expiry_date?: string;
};

const bloodGroups = [
  "A+","A-","B+","B-","AB+","AB-","O+","O-"
];

const InventoryPage = () => {

  const role = localStorage.getItem("role");

  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [form, setForm] = useState<InventoryForm>({
    blood_group: "",
    units: "",
    expiry_date: ""
  });

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {

    try {

      const data = await getInventory();

      if (Array.isArray(data)) {
        setInventory(data);
      } else {
        setInventory([]);
      }

    } catch (error) {

      console.error("Inventory load error", error);
      setInventory([]);

    }

  }

  /* ---------------- ADD INVENTORY ---------------- */

  async function addInventory(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    if (role !== "ADMIN") {
      alert("Only admins can add inventory");
      return;
    }

    if (!bloodGroups.includes(form.blood_group)) {
      alert("Invalid blood group");
      return;
    }

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/inventory/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          blood_group: form.blood_group,
          units: parseInt(form.units),
          expiry_date: form.expiry_date
        })
      });

      if (!res.ok) {
        throw new Error("Failed to add inventory");
      }

      setForm({
        blood_group: "",
        units: "",
        expiry_date: ""
      });

      loadInventory();

    } catch (err) {

      console.error("Inventory add error", err);

    }

  }

  /* ---------------- STATS ---------------- */

  const totalUnits = inventory.reduce(
    (sum, item) => sum + Number(item.units || 0),
    0
  );

  const lowStock = inventory.filter(
    (item) => Number(item.units || 0) < 20
  ).length;

  const expiringSoon = inventory.filter((item) => {

    if (!item.expiry_date) return false;

    const expiry = new Date(item.expiry_date).getTime();
    const now = new Date().getTime();

    const days = (expiry - now) / (1000 * 60 * 60 * 24);

    return days < 5;

  }).length;

  return (

    <DashboardLayout>

      <div className="space-y-6">

        <div>

          <h1 className="text-2xl font-bold text-foreground">
            Blood Inventory
          </h1>

          <p className="text-sm text-muted-foreground">
            Real-time hospital blood stock
          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <StatCard
            title="Total Units"
            value={totalUnits}
            icon={Package}
          />

          <StatCard
            title="Low Stock Groups"
            value={lowStock}
            changeType="negative"
            icon={AlertTriangle}
          />

          <StatCard
            title="Blood Types"
            value={inventory.length}
            icon={Clock}
          />

          <StatCard
            title="Expiring Soon"
            value={expiringSoon}
            changeType="negative"
            icon={AlertTriangle}
          />

        </div>

        {/* ADD INVENTORY FORM (ADMIN ONLY) */}

        {role === "ADMIN" && (

          <div className="bg-card border rounded-xl p-5">

            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <Plus className="h-4 w-4" />
              Add Blood Inventory
            </h3>

            <form
              onSubmit={addInventory}
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >

              <select
                className="border rounded p-2 text-sm"
                value={form.blood_group}
                onChange={(e) =>
                  setForm({ ...form, blood_group: e.target.value })
                }
                required
              >

                <option value="">Select Blood Group</option>

                {bloodGroups.map((g) => (
                  <option key={g}>{g}</option>
                ))}

              </select>

              <input
                type="number"
                placeholder="Units"
                className="border rounded p-2 text-sm"
                value={form.units}
                onChange={(e) =>
                  setForm({ ...form, units: e.target.value })
                }
                required
              />

              <input
                type="date"
                className="border rounded p-2 text-sm"
                value={form.expiry_date || ""}
                onChange={(e) =>
                  setForm({ ...form, expiry_date: e.target.value })
                }
              />

              <button
                type="submit"
                className="bg-primary text-white rounded p-2 text-sm col-span-full"
              >
                Add Inventory
              </button>

            </form>

          </div>

        )}

        {/* INVENTORY GRID */}

        <BloodInventoryGrid />

      </div>

    </DashboardLayout>

  );

};

export default InventoryPage;