import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getRequests } from "@/services/api";

export function RecentRequests() {

  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      setRequests([]);
      return;
    }

    loadRequests();

  }, []);

  async function loadRequests() {

    try {

      const data = await getRequests();

      if (Array.isArray(data)) {
        setRequests(data.slice(0, 5));
      } else {
        setRequests([]);
      }

    } catch (error) {

      console.error("Requests fetch error:", error);
      setRequests([]);

    }

  }

  const pendingCount = requests.filter(
    (r) => r.status === "PENDING"
  ).length;

  // 🔥 PRIORITY COLOR FUNCTION
  function getPriorityColor(priority: string) {
    if (priority === "HIGH") return "bg-red-500/10 text-red-500";
    if (priority === "NORMAL") return "bg-yellow-500/10 text-yellow-500";
    return "bg-green-500/10 text-green-500";
  }

  return (
    <div className="bg-card rounded-xl border">

      <div className="p-5 border-b flex items-center justify-between">

        <div>

          <h3 className="text-sm font-semibold">
            Recent Blood Requests
          </h3>

          <p className="text-xs text-muted-foreground">
            Latest hospital requests
          </p>

        </div>

        <Badge variant="outline" className="text-[10px]">
          {pendingCount} pending
        </Badge>

      </div>

      <div className="divide-y">

        {requests.map((req) => (

          <div
            key={req.id}
            className="px-5 py-3 flex items-center gap-4 hover:bg-muted/30"
          >

            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <span className="font-mono text-xs font-bold">
                {req.blood_group}
              </span>
            </div>

            <div className="flex-1">

              <p className="text-sm font-medium">
                {req.requester_name}
              </p>

              <p className="text-xs text-muted-foreground">
                {req.units_required} units · {req.hospital}
              </p>

            </div>

            {/* 🔥 PRIORITY + STATUS */}

            <div className="flex flex-col items-end gap-1">

              {/* PRIORITY BADGE */}
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getPriorityColor(req.priority)}`}
              >
                {req.priority || "LOW"}
              </span>

              {/* STATUS BADGE */}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-info/10 text-info">
                {req.status}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}