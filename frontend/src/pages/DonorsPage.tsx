import { DashboardLayout } from "@/components/DashboardLayout";
import { Users, UserCheck, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getDonors } from "@/services/api";

const DonorsPage = () => {

  const [donors, setDonors] = useState<any[]>([]);

  useEffect(() => {
    loadDonors();
  }, []);

  async function loadDonors() {

    try {

      const data = await getDonors();

      setDonors(data);

    } catch (error) {

      console.error("Failed to load donors", error);

    }

  }

  const total = donors.length;

  return (
    <DashboardLayout>

      <div className="space-y-6">

        <div>

          <h1 className="text-2xl font-bold text-foreground">
            Donor Management
          </h1>

          <p className="text-sm text-muted-foreground">
            Registered blood donors
          </p>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <StatCard
            title="Total Donors"
            value={total}
            icon={Users}
          />

          <StatCard
            title="Available"
            value={total}
            icon={UserCheck}
            delay={0.1}
          />

          <StatCard
            title="Recent Donors"
            value={total}
            icon={Clock}
            delay={0.2}
          />

        </div>

        {/* Table */}

        <div className="bg-card rounded-xl border overflow-hidden">

          <div className="p-5 border-b">

            <h3 className="text-sm font-semibold text-foreground">
              Registered Donors
            </h3>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="bg-muted/50">

                  <th className="px-4 py-3 text-left text-xs">Name</th>

                  <th className="px-4 py-3 text-left text-xs">Blood Group</th>

                  <th className="px-4 py-3 text-left text-xs">Age</th>

                  <th className="px-4 py-3 text-left text-xs">Gender</th>

                  <th className="px-4 py-3 text-left text-xs">City</th>

                  <th className="px-4 py-3 text-left text-xs">Contact</th>

                  <th className="px-4 py-3 text-left text-xs">Email</th>

                </tr>

              </thead>

              <tbody>

                {donors.map((d, i) => (

                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-t"
                  >

                    <td className="px-4 py-3 font-medium">
                      {d.name}
                    </td>

                    <td className="px-4 py-3 font-mono">
                      {d.blood_group}
                    </td>

                    <td className="px-4 py-3">
                      {d.age}
                    </td>

                    <td className="px-4 py-3">
                      {d.gender}
                    </td>

                    <td className="px-4 py-3">
                      {d.city}
                    </td>

                    <td className="px-4 py-3">
                      {d.contact_number}
                    </td>

                    <td className="px-4 py-3">
                      {d.email}
                    </td>

                  </motion.tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );

};

export default DonorsPage;