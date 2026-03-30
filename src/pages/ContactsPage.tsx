import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Mail, MessageSquare, Linkedin, Globe, X } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  role: string;
  category: string;
  email?: string;
  slack?: string;
  linkedin?: string;
  timezone?: string;
  compensation?: string;
  notes?: string;
}

const categories = ["All", "Internal Team", "Content Team", "External", "Clients"];

const contacts: Contact[] = [
  { id: "c1", name: "Ansh", role: "Founder & CEO", category: "Internal Team", email: "ansh@velocityos.ai", slack: "@ansh", timezone: "UTC+0", notes: "Building Velocity OS. Running CRO agency. Creating content." },
  { id: "c2", name: "Dev Contractor", role: "Full-stack Developer", category: "Internal Team", email: "dev@contractor.io", slack: "@dev", timezone: "UTC+5:30", compensation: "$80/hr", notes: "Available 30hrs/week. Strong in React + Supabase." },
  { id: "c3", name: "Video Editor", role: "YouTube Editor", category: "Content Team", email: "editor@creative.co", slack: "@editor", timezone: "UTC-5", compensation: "$50/video", notes: "2-day turnaround. Prefers Frame.io for review." },
  { id: "c4", name: "Designer", role: "Brand & Thumbnail Designer", category: "Content Team", email: "design@creative.co", timezone: "UTC+1", compensation: "$40/hr", notes: "Figma-first workflow. Available for thumbnails + social graphics." },
  { id: "c5", name: "YC Partner", role: "Advisor", category: "External", email: "partner@yc.com", linkedin: "linkedin.com/in/ycpartner", timezone: "UTC-8", notes: "Bi-weekly check-ins. Focused on GTM strategy." },
  { id: "c6", name: "Angel Investor", role: "Investor / Advisor", category: "External", email: "angel@invest.vc", linkedin: "linkedin.com/in/angel", timezone: "UTC+0", notes: "Pre-seed investor. Intro'd 2 DTC clients." },
  { id: "c7", name: "NovaSkin", role: "DTC Skincare Brand", category: "Clients", email: "team@novaskin.co", slack: "#novaskin-collab", timezone: "UTC-5", compensation: "$5K/mo retainer", notes: "Shopify Plus. Goal: 2.1% → 3.5% checkout CVR." },
  { id: "c8", name: "PeakFit", role: "DTC Fitness Supplements", category: "Clients", email: "growth@peakfit.com", timezone: "UTC-8", compensation: "$4K/mo retainer", notes: "Shopify. Focus on PDP and cart optimization." },
];

export default function ContactsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filtered = activeCategory === "All" ? contacts : contacts.filter((c) => c.category === activeCategory);

  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader title="Contacts / CRM" description="Manage your network and client relationships." />

        <div className="flex gap-1.5 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedContact(c)}
              className="text-left rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-bold shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.role}</p>
                  <span className="text-[10px] text-primary">{c.category}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                {c.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" /><span className="truncate">{c.email}</span></div>}
                {c.timezone && <div className="flex items-center gap-1"><Globe className="h-3 w-3" /><span>{c.timezone}</span></div>}
              </div>
            </button>
          ))}
        </div>

        {selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setSelectedContact(null)}>
            <div className="w-full max-w-md rounded-lg border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">{selectedContact.name.charAt(0)}</div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{selectedContact.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedContact.role}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedContact(null)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-3 text-sm">
                {selectedContact.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{selectedContact.email}</span></div>}
                {selectedContact.slack && <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{selectedContact.slack}</span></div>}
                {selectedContact.linkedin && <div className="flex items-center gap-2"><Linkedin className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{selectedContact.linkedin}</span></div>}
                {selectedContact.timezone && <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{selectedContact.timezone}</span></div>}
                {selectedContact.compensation && <div className="mt-3 rounded-md bg-muted p-3"><p className="text-xs text-muted-foreground">Compensation</p><p className="text-sm font-medium text-foreground">{selectedContact.compensation}</p></div>}
                {selectedContact.notes && <div className="mt-3 pt-3 border-t border-border"><p className="text-xs text-muted-foreground mb-1">Notes</p><p className="text-sm text-secondary-foreground">{selectedContact.notes}</p></div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
