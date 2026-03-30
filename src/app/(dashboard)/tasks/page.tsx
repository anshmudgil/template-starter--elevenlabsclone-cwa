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
import { NativeSelect } from "@/components/ui/native-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TASK_COLUMNS,
  taskColumnTitle,
  useCreateTask,
  useTasks,
  useUpsertTasksOrder,
} from "@/hooks/use-mission-control";
import { buildKanbanOrderUpdates } from "@/lib/kanban-reorder";
import type { Tables } from "@/integrations/supabase/types";

export default function TasksPage() {
  const { data: tasks = [], isLoading } = useTasks();
  const upsertOrder = useUpsertTasksOrder();
  const createTask = useCreateTask();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("General");
  const [assignee, setAssignee] = useState("Unassigned");
  const [priority, setPriority] = useState("medium");

  const columns = useMemo(() => {
    const m: Record<string, Tables<"tasks">[]> = {};
    for (const c of TASK_COLUMNS) {
      m[c] = tasks.filter((t) => t.column_id === c).sort((a, b) => a.sort_order - b.sort_order);
    }
    return m;
  }, [tasks]);

  const onDragEnd = (result: DropResult) => {
    const updates = buildKanbanOrderUpdates(tasks, TASK_COLUMNS, result);
    if (updates.length) upsertOrder.mutate(updates);
  };

  const submitNew = () => {
    const t = title.trim();
    if (!t) return;
    const colTasks = columns["backlog"] ?? [];
    createTask.mutate(
      {
        title: t,
        column_id: "backlog",
        sort_order: colTasks.length,
        project,
        assignee,
        priority,
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
        title="Tasks"
        description="Kanban for delivery work — drag cards between columns."
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-6">
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                New task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="task-title">Title</Label>
                  <Input
                    id="task-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ship v2 dashboard"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="task-project">Project</Label>
                  <Input id="task-project" value={project} onChange={(e) => setProject(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="task-assignee">Assignee</Label>
                    <Input
                      id="task-assignee"
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="task-priority">Priority</Label>
                    <NativeSelect
                      id="task-priority"
                      className="w-full"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </NativeSelect>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitNew} disabled={!title.trim() || createTask.isPending}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading tasks…</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {TASK_COLUMNS.map((col) => (
                <div key={col} className="flex min-h-0 flex-col rounded-lg border border-border bg-card">
                  <div className="shrink-0 border-b border-border px-3 py-2">
                    <span className="text-xs font-semibold text-foreground">{taskColumnTitle(col)}</span>
                    <span className="ml-2 text-xs text-muted-foreground">({columns[col]?.length ?? 0})</span>
                  </div>
                  <Droppable droppableId={col}>
                    {(prov, snap) => (
                      <ScrollArea className="h-[min(70vh,560px)]">
                        <div
                          ref={prov.innerRef}
                          {...prov.droppableProps}
                          className={`min-h-32 space-y-2 p-2 ${snap.isDraggingOver ? "bg-accent/40" : ""}`}
                        >
                          {(columns[col] ?? []).map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(dp) => (
                                <div
                                  ref={dp.innerRef}
                                  {...dp.draggableProps}
                                  {...dp.dragHandleProps}
                                  className="rounded-md border border-border bg-card px-3 py-2 text-sm shadow-sm cursor-grab active:cursor-grabbing"
                                >
                                  <div className="font-medium text-foreground">{task.title}</div>
                                  <div className="mt-1 flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                                    <span>{task.project}</span>
                                    <span>·</span>
                                    <span className="capitalize">{task.priority}</span>
                                    {task.assignee ? (
                                      <>
                                        <span>·</span>
                                        <span>{task.assignee}</span>
                                      </>
                                    ) : null}
                                  </div>
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
          </DragDropContext>
        )}
      </div>
    </>
  );
}
