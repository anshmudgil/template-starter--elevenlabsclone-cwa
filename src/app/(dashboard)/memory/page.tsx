"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { MissionPageHeader } from "@/components/mission-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMemory, useMemories } from "@/hooks/use-mission-control";
import { formatRelativeTime } from "@/lib/format-relative-time";

export default function MemoryPage() {
  const { data: memories = [], isLoading } = useMemories();
  const createMemory = useCreateMemory();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("note");
  const [content, setContent] = useState("");

  const submit = () => {
    const t = title.trim();
    const body = content.trim();
    if (!t || !body) return;
    const preview = body.length > 160 ? `${body.slice(0, 157)}…` : body;
    createMemory.mutate(
      { title: t, category, content: body, preview },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle("");
          setContent("");
        },
      },
    );
  };

  return (
    <>
      <MissionPageHeader
        title="Memory"
        description="Long-lived notes and decisions your agents can reference."
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-6">
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                New memory
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add memory</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="mem-title">Title</Label>
                  <Input id="mem-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="mem-cat">Category</Label>
                  <Input
                    id="mem-cat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="decision, playbook, contact…"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="mem-body">Content</Label>
                  <Textarea
                    id="mem-body"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="resize-y"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={submit}
                  disabled={!title.trim() || !content.trim() || createMemory.isPending}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading memories…</p>
        ) : memories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No memories yet.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {memories.map((m) => (
              <li key={m.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-foreground">{m.title}</h3>
                  <Badge variant="outline" className="shrink-0 capitalize">
                    {m.category}
                  </Badge>
                </div>
                {m.preview ? (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{m.preview}</p>
                ) : null}
                <p className="mt-2 text-xs text-muted-foreground">{formatRelativeTime(m.created_at)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
