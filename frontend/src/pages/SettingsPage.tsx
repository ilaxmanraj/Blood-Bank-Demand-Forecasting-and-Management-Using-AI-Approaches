import { DashboardLayout } from "@/components/DashboardLayout";
import { Settings, Database, BrainCircuit, Bell, Shield, Globe } from "lucide-react";

const sections = [
  { title: 'General', desc: 'System preferences and configuration', icon: Settings },
  { title: 'Database', desc: 'Firestore collections and indexing', icon: Database },
  { title: 'AI Engine', desc: 'Model parameters and training schedule', icon: BrainCircuit },
  { title: 'Notifications', desc: 'SMS, Email, WhatsApp API configuration', icon: Bell },
  { title: 'Security', desc: 'Authentication and role-based access', icon: Shield },
  { title: 'Integrations', desc: 'Maps API, Twilio, SendGrid setup', icon: Globe },
];

const SettingsPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">System configuration and integrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <div key={s.title} className="bg-card rounded-xl border p-5 hover:shadow-[var(--shadow-elevated)] transition-shadow cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
              <s.icon className="h-5 w-5 text-accent-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="font-semibold text-sm text-foreground">{s.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">API Endpoints</h3>
        <div className="space-y-2">
          {[
            'POST /api/registerDonor',
            'GET /api/donors',
            'POST /api/createBloodRequest',
            'GET /api/inventory',
            'POST /api/predictDemand',
            'GET /api/notifications',
          ].map(ep => (
            <div key={ep} className="flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-lg">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${ep.startsWith('POST') ? 'bg-primary/10 text-primary' : 'bg-info/10 text-info'}`}>
                {ep.split(' ')[0]}
              </span>
              <span className="text-xs font-mono text-foreground">{ep.split(' ')[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default SettingsPage;
