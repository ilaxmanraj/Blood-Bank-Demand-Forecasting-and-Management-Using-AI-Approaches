import { DashboardLayout } from "@/components/DashboardLayout";
import {
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

import { StatCard } from "@/components/StatCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getRequests, approveRequest } from "@/services/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type RequestItem = {
  id: number
  requester_name: string
  hospital: string
  blood_group: string
  units_required: number
  status: "PENDING" | "APPROVED" | "REJECTED"
}

const statusStyles: Record<string,string> = {
  PENDING: "bg-warning/10 text-warning border-warning/20",
  APPROVED: "bg-success/10 text-success border-success/20",
  REJECTED: "bg-destructive/10 text-destructive border-destructive/20"
}

const API_URL = "http://127.0.0.1:8000"

const RequestsPage = () => {

  const role = localStorage.getItem("role")

  const [requests,setRequests] = useState<RequestItem[]>([])
  const [loadingId,setLoadingId] = useState<number | null>(null)

  useEffect(()=>{
    loadRequests()
  },[])

  async function loadRequests(){

    try{

      const data = await getRequests()

      setRequests(Array.isArray(data) ? data : [])

    }catch(err){

      console.error("Failed to load requests",err)
      setRequests([])

    }

  }

  /* ---------------- APPROVE ---------------- */

  async function handleApprove(id:number){

    if(role !== "ADMIN"){
      toast.error("Only admin can approve requests")
      return
    }

    try{

      setLoadingId(id)

      await approveRequest(id)

      toast.success("Request approved")

      loadRequests()

    }catch(err){

      console.error(err)
      toast.error("Approval failed")

    }finally{

      setLoadingId(null)

    }

  }

  /* ---------------- REJECT ---------------- */

  async function handleReject(id:number){

    if(role !== "ADMIN"){
      toast.error("Only admin can reject requests")
      return
    }

    try{

      setLoadingId(id)

      const token = localStorage.getItem("token")

      await fetch(`${API_URL}/request/reject?request_id=${id}`,{
        method:"POST",
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      toast.success("Request rejected")

      loadRequests()

    }catch(err){

      console.error(err)
      toast.error("Reject failed")

    }finally{

      setLoadingId(null)

    }

  }

  /* ---------------- STATS ---------------- */

  const total = requests.length

  const pending = requests.filter(r=>r.status==="PENDING").length

  const approved = requests.filter(r=>r.status==="APPROVED").length

  const critical = requests.filter(
    r => r.status === "PENDING" && r.units_required >= 5
  ).length

  return(

    <DashboardLayout>

      <div className="space-y-6">

        <div>

          <h1 className="text-2xl font-bold text-foreground">
            Blood Requests
          </h1>

          <p className="text-sm text-muted-foreground">
            Hospital blood requests
          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <StatCard
            title="Total Requests"
            value={total}
            icon={ClipboardList}
          />

          <StatCard
            title="Pending"
            value={pending}
            icon={Clock}
          />

          <StatCard
            title="Approved"
            value={approved}
            icon={CheckCircle}
          />

          <StatCard
            title="Critical"
            value={critical}
            changeType="negative"
            icon={AlertTriangle}
          />

        </div>

        {/* REQUEST LIST */}

        <div className="space-y-3">

          {requests.map((req,i)=>(

            <motion.div
              key={req.id}
              initial={{opacity:0,y:8}}
              animate={{opacity:1,y:0}}
              transition={{delay:i*0.05}}
              className="bg-card rounded-xl border p-5"
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="font-semibold text-foreground">
                    {req.requester_name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {req.hospital}
                  </p>

                  <div className="flex gap-3 mt-2">

                    <span className="text-xs font-mono">
                      {req.blood_group}
                    </span>

                    <span className="text-xs">
                      {req.units_required} units
                    </span>

                  </div>

                </div>

                <div className="flex flex-col items-end gap-2">

                  <span
                    className={`text-[10px] px-3 py-1 rounded-full border ${statusStyles[req.status]}`}
                  >
                    {req.status}
                  </span>

                  {/* ADMIN CONTROLS */}

                  {req.status==="PENDING" && role==="ADMIN" &&(

                    <div className="flex gap-2">

                      <Button
                        size="sm"
                        disabled={loadingId===req.id}
                        onClick={()=>handleApprove(req.id)}
                      >
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={loadingId===req.id}
                        onClick={()=>handleReject(req.id)}
                      >
                        Reject
                      </Button>

                    </div>

                  )}

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </DashboardLayout>

  )

}

export default RequestsPage