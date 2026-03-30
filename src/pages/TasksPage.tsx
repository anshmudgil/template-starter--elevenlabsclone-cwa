import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusDot } from "@/components/StatusDot";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Calendar, User, Flag } from "lucide-react";

type Priority = "low" | "medium" | "high" | "urgent";
type Assignee = "Ansh" | "VELO";
type Project = "Velocity OS" | "Agency Client Delivery" | "Personal Brand";

interface Task {
  id: string;
  title: string;
  assignee: Assignee;
  priority: Priority;
  dueDate: string;
  project: Project;
  description?: string;
}

const priorityColors: Record<Priority, string> = {
  low: "text-muted-foreground",
  medium: "text-primary",
  high: "text-warning",
  urgent: "text-destructive",
};

const projectColors: Record<Project, string> = {
  "Velocity OS": "bg-velocity/20 text-velocity",
  "Agency Client Delivery": "bg-agency/20 text-agency",
  "Personal Brand": "bg-content/20 text-content",
};

const initialColumns: Record<string, { title: string; tasks: Task[] }> = {
  backlog: {
    title: "Backlog",
    tasks: [
      { id: "t1", title: "Design onboarding flow", assignee: "Ansh", priority: "high", dueDate: "Apr 2", project: "Velocity OS" },
      { id: "t2", title: "Set up GA4 conversion funnels", assignee: "VELO", priority: "medium", dueDate: "Apr 5", project: "Agency Client Delivery" },
      { id: "t3", title: "Research YouTube SEO tools", assignee: "Ansh", priority: "low", dueDate: "Apr 7", project: "Personal Brand" },
    ],
  },
  inProgress: {
    title: "In Progress",
    tasks: [
      { id: "t4", title: "Build experiment engine v2", assignee: "VELO", priority: "urgent", dueDate: "Mar 31", project: "Velocity OS" },
      { id: "t5", title: "A/B test hero section for DTC client", assignee: "VELO", priority: "high", dueDate: "Apr 1", project: "Agency Client Delivery" },
    ],
  },
  review: {
    title: "Review / QA",
    tasks: [
      { id: "t6", title: "Review landing page copy variants", assignee: "Ansh", priority: "medium", dueDate: "Mar 31", project: "Agency Client Delivery" },
    ],
  },
  done: {
    title: "Done",
    tasks: [
      { id: "t7", title: "Deploy attribution model v1", assignee: "VELO", priority: "high", dueDate: "Mar 28", project: "Velocity OS" },
      { id: "t8", title: "Publish LinkedIn post — CRO framework", assignee: "Ansh", priority: "medium", dueDate: "Mar 28", project: "Personal Brand" },
    ],
  },
};

export default function TasksPage() {
  const [columns, setColumns] = useState(initialColumns);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = { ...columns[source.droppableId] };
    const destCol = source.droppableId === destination.droppableId
      ? sourceCol
      : { ...columns[destination.droppableId] };

    const sourceTasks = [...sourceCol.tasks];
    const [moved] = sourceTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, moved);
      setColumns({ ...columns, [source.droppableId]: { ...sourceCol, tasks: sourceTasks } });
    } else {
      const destTasks = [...destCol.tasks];
      destTasks.splice(destination.index, 0, moved);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, tasks: sourceTasks },
        [destination.droppableId]: { ...destCol, tasks: destTasks },
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader title="Tasks Board" description="Manage and track all project tasks." />

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {Object.entries(columns).map(([colId, col]) => (
              <div key={colId} className="w-72 shrink-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{col.title}</h3>
                  <span className="text-xs text-muted-foreground">{col.tasks.length}</span>
                </div>
                <Droppable droppableId={colId}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2 min-h-[200px]"
                    >
                      {col.tasks.map((task, idx) => (
                        <Draggable key={task.id} draggableId={task.id} index={idx}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedTask(task)}
                              className={`rounded-lg border border-border bg-card p-3.5 cursor-pointer transition-all hover:border-primary/30 ${
                                snapshot.isDragging ? "shadow-lg shadow-primary/10 border-primary/50" : ""
                              }`}
                            >
                              <p className="text-sm font-medium text-foreground mb-2">{task.title}</p>
                              <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${projectColors[task.project]}`}>
                                {task.project}
                              </span>
                              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                  <User className="h-3 w-3" />
                                  <span>{task.assignee}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1">
                                    <Flag className={`h-3 w-3 ${priorityColors[task.priority]}`} />
                                    <span className={priorityColors[task.priority]}>{task.priority}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{task.dueDate}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setSelectedTask(null)}>
            <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-bold text-foreground mb-1">{selectedTask.title}</h2>
              <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium mb-4 ${projectColors[selectedTask.project]}`}>
                {selectedTask.project}
              </span>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Assignee</span>
                  <p className="text-foreground font-medium">{selectedTask.assignee}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Priority</span>
                  <p className={`font-medium ${priorityColors[selectedTask.priority]}`}>{selectedTask.priority}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Due Date</span>
                  <p className="text-foreground font-medium">{selectedTask.dueDate}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">Task description and comments will appear here.</p>
              </div>
              <button onClick={() => setSelectedTask(null)} className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
