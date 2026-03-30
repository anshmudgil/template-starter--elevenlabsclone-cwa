"use client";

import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { MissionPageHeader } from "@/components/mission-page-header";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CONTENT_COLUMNS,
  contentColumnTitle,
  useContentItems,
  useCreateContentItem,
  useUpsertContentOrder,
} from "@/hooks/use-mission-control";
import { buildKanbanOrderUpdates } from "@/lib/kanban-reorder";
import type { Tables } from "@/integrations/supabase/types";

export default function ContentPage() {
  const { data: items = [], isLoading } = useContentItems();
  const upsertOrder = useUpsertContentOrder();
  const createItem = useCreateContentItem();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("YouTube");

  const columns = useMemo(() => {
    const m: Record<string, Tables<"content_items">[]> = {};
    for (const c of CONTENT_COLUMNS) {
      m[c] = items.filter((t) => t.column_id === c).sort((a, b) => a.sort_order - b.sort_order);
    }
    return m;
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    const updates = buildKanbanOrderUpdates(items, CONTENT_COLUMNS, result);
    if (updates.length) upsertOrder.mutate(updates);
  };

  const submitNew = () => {
    const t = title.trim();
    if (!t) return;
    const colItems = columns["idea"] ?? [];
    createItem.mutate(
      {
        title: t,
        column_id: "idea",
        sort_order: colItems.length,
        platform,
        status: "idea",
      },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle("");
        },
      },
    );
  };

  return (
    <>
      <MissionPageHeader
        title="Content"
        description="Production pipeline from idea to published."
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-6">
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                New piece
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add content</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="content-title">Title</Label>
                  <Input
                    id="content-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Q2 launch breakdown"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="content-platform">Platform</Label>
                  <Input
                    id="content-platform"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitNew} disabled={!title.trim() || createItem.isPending}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading content…</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="min-h-0 flex-1 overflow-x-auto pb-2">
              <div className="flex min-h-0 w-max gap-3">
                {CONTENT_COLUMNS.map((col) => (
                  <div
                    key={col}
                    className="flex w-64 shrink-0 flex-col rounded-lg border border-border bg-card md:w-72"
                  >
                    <div className="shrink-0 border-b border-border px-3 py-2">
                      <span className="text-xs font-semibold text-foreground">
                        {contentColumnTitle(col)}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({columns[col]?.length ?? 0})
                      </span>
                    </div>
                    <Droppable droppableId={col}>
                      {(prov, snap) => (
                        <ScrollArea className="h-[min(70vh,520px)]">
                          <div
                            ref={prov.innerRef}
                            {...prov.droppableProps}
                            className={`min-h-32 space-y-2 p-2 ${snap.isDraggingOver ? "bg-accent/40" : ""}`}
                          >
                            {(columns[col] ?? []).map((row, index) => (
                              <Draggable key={row.id} draggableId={row.id} index={index}>
                                {(dp) => (
                                  <div
                                    ref={dp.innerRef}
                                    {...dp.draggableProps}
                                    {...dp.dragHandleProps}
                                    className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm cursor-grab active:cursor-grabbing"
                                  >
                                    <div className="font-medium text-foreground">{row.title}</div>
                                    <div className="mt-1 text-xs text-muted-foreground">{row.platform}</div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {prov.placeholder}
                          </div>
                        </ScrollArea>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </div>
          </DragDropContext>
        )}
      </div>
    </>
  );
}
