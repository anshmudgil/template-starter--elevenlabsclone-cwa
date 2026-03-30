import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Search, X, FileText } from "lucide-react";

interface Memory {
  id: string;
  title: string;
  category: string;
  dateCreated: string;
  preview: string;
  content: string;
}

const categories = ["All", "Product Decisions", "CRO Playbooks", "Client Notes", "Content", "Archive"];

const memories: Memory[] = [
  { id: "m1", title: "Velocity OS — PRD v2", category: "Product Decisions", dateCreated: "Mar 25, 2026", preview: "Core product spec for the experiment engine, attribution model, and agent orchestration layer...", content: "# Velocity OS — PRD v2\n\nCore product spec for the experiment engine, attribution model, and agent orchestration layer.\n\n## Objective\nBuild an autonomous CRO platform that runs experiments, analyzes results, and deploys winning variants — all managed by VELO.\n\n## Key Features\n- Experiment Engine v2\n- Multi-touch Attribution Model\n- Agent Orchestration Dashboard\n- Real-time Data Pipeline" },
  { id: "m2", title: "Exit-Intent Popup Framework", category: "CRO Playbooks", dateCreated: "Mar 22, 2026", preview: "A/B test framework for exit-intent popups: trigger timing, copy variants, offer types, and measurement...", content: "# Exit-Intent Popup Framework\n\nA comprehensive testing framework covering trigger timing (50% vs 75% scroll), copy variants (urgency vs value), offer types (discount vs free shipping), and measurement methodology." },
  { id: "m3", title: "Client Brief — NovaSkin", category: "Client Notes", dateCreated: "Mar 20, 2026", preview: "DTC skincare brand. $2M ARR. Primary goal: improve checkout CVR from 2.1% to 3.5%...", content: "# NovaSkin Client Brief\n\nDTC skincare brand doing $2M ARR on Shopify Plus. Primary goal: improve checkout CVR from 2.1% to 3.5%. Key pages: PDP, Cart, Checkout. Budget: $5K/mo retainer." },
  { id: "m4", title: "YouTube Script — How I Built an AI CRO Agent", category: "Content", dateCreated: "Mar 18, 2026", preview: "Hook: What if your CRO team never slept? Opening sequence: show VELO running experiments at 3am...", content: "# YouTube Script\n\n## Hook\nWhat if your CRO team never slept?\n\n## Opening\nShow VELO running experiments at 3am while I'm sleeping. Cut to results dashboard showing +14% CVR.\n\n## Act 1 — The Problem\nManual CRO is slow. Agencies charge $10K/mo. Most DTC brands can't afford it." },
  { id: "m5", title: "Architecture: Data Pipeline", category: "Product Decisions", dateCreated: "Mar 15, 2026", preview: "Shopify → Webhook → Supabase → Transform → Analytics. Real-time event streaming for experiment data...", content: "# Data Pipeline Architecture\n\nShopify webhooks → Edge Functions → Supabase (raw events) → Transform layer → Analytics tables.\n\nReal-time streaming for experiment events. Batch processing for attribution modeling." },
  { id: "m6", title: "Pricing Model Research", category: "Archive", dateCreated: "Mar 10, 2026", preview: "Competitive analysis: VWO, Optimizely, Convert.com. Pricing tiers and feature comparison...", content: "# Pricing Research\n\nCompetitive analysis of CRO tools. VWO: $199/mo, Optimizely: custom, Convert.com: $99/mo. Our positioning: AI-first, autonomous — premium pricing justified." },
];

export default function MemoryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const filtered = memories.filter((m) => {
    const matchesSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.preview.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || m.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader title="Memory" description="Searchable knowledge base and document library." />

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search memories..."
              className="w-full rounded-lg border border-border bg-muted pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

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
          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMemory(m)}
              className="text-left rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent shrink-0 mt-0.5">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground mb-0.5">{m.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{m.category}</span>
                    <span>·</span>
                    <span>{m.dateCreated}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{m.preview}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setSelectedMemory(null)}>
            <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{selectedMemory.title}</h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{selectedMemory.category}</span>
                    <span>·</span>
                    <span>{selectedMemory.dateCreated}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedMemory(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                {selectedMemory.content.split("\n").map((line, i) => {
                  if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-bold text-foreground mb-3">{line.replace("# ", "")}</h1>;
                  if (line.startsWith("## ")) return <h2 key={i} className="text-base font-semibold text-foreground mt-4 mb-2">{line.replace("## ", "")}</h2>;
                  if (line.startsWith("- ")) return <li key={i} className="text-sm text-secondary-foreground ml-4">{line.replace("- ", "")}</li>;
                  if (line.trim() === "") return <br key={i} />;
                  return <p key={i} className="text-sm text-secondary-foreground mb-1">{line}</p>;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
