import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Youtube, Linkedin, Twitter, BookOpen, Calendar } from "lucide-react";

type Platform = "YouTube" | "LinkedIn" | "X" | "Blog";

const platformIcons: Record<Platform, React.ElementType> = {
  YouTube: Youtube,
  LinkedIn: Linkedin,
  X: Twitter,
  Blog: BookOpen,
};

const platformColors: Record<Platform, string> = {
  YouTube: "text-red-400",
  LinkedIn: "text-blue-400",
  X: "text-foreground",
  Blog: "text-content",
};

interface ContentItem {
  id: string;
  title: string;
  platform: Platform;
  day: string;
  status: string;
}

const initialColumns: Record<string, { title: string; items: ContentItem[] }> = {
  idea: { title: "Idea", items: [
    { id: "c1", title: "Why most CRO agencies fail", platform: "YouTube", day: "Wednesday", status: "idea" },
    { id: "c2", title: "The compound effect of micro-optimizations", platform: "LinkedIn", day: "Tuesday", status: "idea" },
  ]},
  scripting: { title: "Scripting", items: [
    { id: "c3", title: "How I built an AI agent to run CRO", platform: "YouTube", day: "Wednesday", status: "scripting" },
    { id: "c4", title: "Exit intent popup framework", platform: "LinkedIn", day: "Thursday", status: "scripting" },
  ]},
  recording: { title: "Recording / Drafting", items: [
    { id: "c5", title: "Velocity OS — Week 4 build log", platform: "LinkedIn", day: "Monday", status: "recording" },
  ]},
  editing: { title: "Editing", items: [
    { id: "c6", title: "From 2% to 5% CVR — a case study", platform: "YouTube", day: "Wednesday", status: "editing" },
  ]},
  review: { title: "Review", items: [] },
  scheduled: { title: "Scheduled", items: [
    { id: "c7", title: "Friday reflection — what I learned shipping daily", platform: "LinkedIn", day: "Friday", status: "scheduled" },
  ]},
  published: { title: "Published", items: [
    { id: "c8", title: "The CRO stack every DTC brand needs", platform: "LinkedIn", day: "Tuesday", status: "published" },
  ]},
};

const weeklySchedule = [
  { day: "Monday", theme: "Velocity OS / Product Build update", platform: "LinkedIn" },
  { day: "Tuesday", theme: "CRO insight or e-commerce tip", platform: "LinkedIn" },
  { day: "Wednesday", theme: "YouTube publish day — founder journey or tutorial", platform: "YouTube" },
  { day: "Thursday", theme: "Agency/Client results or case study teaser", platform: "LinkedIn" },
  { day: "Friday", theme: "Reflection, lesson, or industry take", platform: "LinkedIn + X" },
];

export default function ContentPage() {
  const [columns, setColumns] = useState(initialColumns);
  const [view, setView] = useState<"kanban" | "calendar">("kanban");

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = { ...columns[source.droppableId] };
    const destCol = source.droppableId === destination.droppableId ? sourceCol : { ...columns[destination.droppableId] };
    const sourceItems = [...sourceCol.items];
    const [moved] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, moved);
      setColumns({ ...columns, [source.droppableId]: { ...sourceCol, items: sourceItems } });
    } else {
      const destItems = [...destCol.items];
      destItems.splice(destination.index, 0, moved);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
        [destination.droppableId]: { ...destCol, items: destItems },
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <PageHeader title="Content Pipeline" description="Manage your content creation workflow." />
          <div className="flex gap-1 rounded-lg border border-border p-0.5">
            <button
              onClick={() => setView("kanban")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${view === "kanban" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Board
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${view === "calendar" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Schedule
            </button>
          </div>
        </div>

        {view === "kanban" ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-3 overflow-x-auto pb-4">
              {Object.entries(columns).map(([colId, col]) => (
                <div key={colId} className="w-60 shrink-0">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{col.title}</h3>
                    <span className="text-xs text-muted-foreground">{col.items.length}</span>
                  </div>
                  <Droppable droppableId={colId}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2 min-h-[120px]">
                        {col.items.map((item, idx) => {
                          const PlatformIcon = platformIcons[item.platform];
                          return (
                            <Draggable key={item.id} draggableId={item.id} index={idx}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`rounded-lg border border-border bg-card p-3 cursor-pointer hover:border-primary/30 transition-all ${
                                    snapshot.isDragging ? "shadow-lg shadow-primary/10 border-primary/50" : ""
                                  }`}
                                >
                                  <p className="text-sm font-medium text-foreground mb-2">{item.title}</p>
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                      <PlatformIcon className={`h-3 w-3 ${platformColors[item.platform]}`} />
                                      <span>{item.platform}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>{item.day}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        ) : (
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-3">
              <h3 className="text-sm font-semibold text-foreground">Weekly Posting Schedule</h3>
            </div>
            <div className="divide-y divide-border">
              {weeklySchedule.map((day) => (
                <div key={day.day} className="flex items-center gap-4 px-5 py-4">
                  <span className="w-24 text-sm font-semibold text-foreground">{day.day}</span>
                  <span className="text-sm text-muted-foreground flex-1">{day.theme}</span>
                  <span className="text-xs text-primary font-medium">{day.platform}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
