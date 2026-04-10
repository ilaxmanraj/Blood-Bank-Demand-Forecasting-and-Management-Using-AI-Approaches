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
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { registerDonor } from "@/services/api";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const genders = ["Male", "Female", "Other"];

interface DonorForm {
  name: string;
  blood_group: string;
  age: string;
  gender: string;
  city: string;
  contact_number: string;
  email: string;
}

const DonorRegistrationPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<DonorForm>({
    name: "",
    blood_group: "",
    age: "",
    gender: "",
    city: "",
    contact_number: "",
    email: "",
  });

  const handleChange = (field: keyof DonorForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const age = parseInt(form.age);

    if (isNaN(age) || age < 18 || age > 65) {
      toast.error("Age must be between 18 and 65");
      return;
    }

    if (
      !form.name ||
      !form.blood_group ||
      !form.gender ||
      !form.city ||
      !form.contact_number
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      await registerDonor({
        name: form.name,
        blood_group: form.blood_group,
        age: age,
        gender: form.gender,
        city: form.city,
        contact_number: form.contact_number,
        email: form.email || null,
      });

      toast.success("Donor registered successfully!");

      navigate("/donors");

    } catch (error: any) {
      toast.error(error.message || "Failed to register donor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-primary" />
            Donor Registration
          </h1>

          <p className="text-sm text-muted-foreground">
            Register as a blood donor to help save lives
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border rounded-xl p-6 space-y-5"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Blood Group *</Label>

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

            <div className="space-y-2">
              <Label>Age *</Label>
              <Input
                type="number"
                placeholder="18-65"
                value={form.age}
                onChange={(e) => handleChange("age", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender *</Label>

              <Select
                value={form.gender}
                onValueChange={(v) => handleChange("gender", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>

                <SelectContent>
                  {genders.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>

            <div className="space-y-2">
              <Label>City *</Label>
              <Input
                placeholder="Your city"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Contact Number *</Label>
              <Input
                placeholder="+91XXXXXXXXXX"
                value={form.contact_number}
                onChange={(e) =>
                  handleChange("contact_number", e.target.value)
                }
              />
            </div>

          </div>

          <div className="space-y-2">
            <Label>Email (optional)</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register as Donor"}
          </Button>

        </form>

      </div>
    </DashboardLayout>
  );
};

export default DonorRegistrationPage;