import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { toast } from "sonner";
import { ClipboardPlus } from "lucide-react";
import { requestBlood } from "@/services/api";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const priorities = ["NORMAL", "URGENT", "CRITICAL"];

const CreateRequestPage = () => {

  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    requester_name: "",
    hospital: "",
    blood_group: "",
    units_required: "",
    priority: "NORMAL"
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (role !== "HOSPITAL") {
      toast.error("Only hospitals can create requests");
      return;
    }

    const units = parseInt(form.units_required);

    if (!form.requester_name || !form.hospital || !form.blood_group) {
      toast.error("Please fill all fields");
      return;
    }

    if (!bloodGroups.includes(form.blood_group)) {
      toast.error("Invalid blood group");
      return;
    }

    if (isNaN(units) || units < 1) {
      toast.error("Units must be at least 1");
      return;
    }

    if (units > 20) {
      toast.error("Maximum request is 20 units");
      return;
    }

    try {

      setLoading(true);

      await requestBlood({
        requester_name: form.requester_name,
        hospital: form.hospital,
        blood_group: form.blood_group,
        units_required: units,
        priority: form.priority
      });

      toast.success("Blood request submitted");

      navigate("/requests");

    } catch (err: any) {

      toast.error(err?.message || "Failed to submit request");

    } finally {

      setLoading(false);

    }

  };

  return (

    <DashboardLayout>

      <div className="max-w-xl mx-auto space-y-6">

        <div>

          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardPlus className="h-6 w-6 text-primary" />
            Create Blood Request
          </h1>

          <p className="text-sm text-muted-foreground">
            Submit a new hospital blood request
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border rounded-xl p-6 space-y-5"
        >

          {/* REQUESTER */}

          <div className="space-y-2">

            <Label>Requester Name</Label>

            <Input
              placeholder="Doctor / Staff name"
              value={form.requester_name}
              onChange={(e) => handleChange("requester_name", e.target.value)}
              required
            />

          </div>

          {/* HOSPITAL */}

          <div className="space-y-2">

            <Label>Hospital</Label>

            <Input
              placeholder="Hospital name"
              value={form.hospital}
              onChange={(e) => handleChange("hospital", e.target.value)}
              required
            />

          </div>

          {/* BLOOD GROUP */}

          <div className="space-y-2">

            <Label>Blood Group</Label>

            <Select
              value={form.blood_group}
              onValueChange={(v) => handleChange("blood_group", v)}
            >

              <SelectTrigger>
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>

              <SelectContent>

                {bloodGroups.map((bg) => (
                  <SelectItem key={bg} value={bg}>
                    {bg}
                  </SelectItem>
                ))}

              </SelectContent>

            </Select>

          </div>

          {/* UNITS */}

          <div className="space-y-2">

            <Label>Units Required</Label>

            <Input
              type="number"
              min={1}
              max={20}
              placeholder="Units"
              value={form.units_required}
              onChange={(e) =>
                handleChange("units_required", e.target.value)
              }
              required
            />

          </div>

          {/* PRIORITY */}

          <div className="space-y-2">

            <Label>Priority</Label>

            <Select
              value={form.priority}
              onValueChange={(v) => handleChange("priority", v)}
            >

              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>

              <SelectContent>

                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}

              </SelectContent>

            </Select>

          </div>

          {/* SUBMIT */}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>

        </form>

      </div>

    </DashboardLayout>

  );

};

export default CreateRequestPage;