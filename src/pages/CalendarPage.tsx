import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  category: "velocity" | "content" | "agency" | "automation";
}

const categoryStyles: Record<string, { bg: string; text: string; label: string }> = {
  velocity: { bg: "bg-velocity/20", text: "text-velocity", label: "Velocity OS" },
  content: { bg: "bg-content/20", text: "text-content", label: "Content" },
  agency: { bg: "bg-agency/20", text: "text-agency", label: "Agency" },
  automation: { bg: "bg-automation/20", text: "text-automation", label: "Automation" },
};

const events: CalendarEvent[] = [
  { id: "e1", title: "Sprint planning — Velocity OS", date: "2026-03-30", time: "10:00", category: "velocity" },
  { id: "e2", title: "LinkedIn post: CRO insight", date: "2026-03-31", time: "09:00", category: "content" },
  { id: "e3", title: "Client call — Shopify merchant", date: "2026-03-31", time: "14:00", category: "agency" },
  { id: "e4", title: "YouTube publish: founder journey", date: "2026-04-01", time: "12:00", category: "content" },
  { id: "e5", title: "VELO data sync cron", date: "2026-04-01", time: "06:00", category: "automation" },
  { id: "e6", title: "LinkedIn: case study teaser", date: "2026-04-02", category: "content" },
  { id: "e7", title: "Review experiment results", date: "2026-04-02", time: "15:00", category: "agency" },
  { id: "e8", title: "Weekly report generation", date: "2026-04-03", time: "08:00", category: "automation" },
  { id: "e9", title: "Friday reflection post", date: "2026-04-03", category: "content" },
  { id: "e10", title: "Experiment engine deploy", date: "2026-04-04", time: "10:00", category: "velocity" },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2)); // March 2026
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const today = new Date();
  const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader title="Calendar" description="Schedule and view all events across projects." />

        <div className="flex items-center gap-2 mb-4">
          {Object.entries(categoryStyles).map(([key, style]) => (
            <span key={key} className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs ${style.bg} ${style.text}`}>
              <span className={`h-2 w-2 rounded-full ${style.bg.replace("/20", "")}`} style={{ backgroundColor: `hsl(var(--${key}))` }} />
              {style.label}
            </span>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <button onClick={prevMonth} className="p-1 rounded hover:bg-accent transition-colors">
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            <h3 className="text-sm font-semibold text-foreground">
              {monthNames[month]} {year}
            </h3>
            <button onClick={nextMonth} className="p-1 rounded hover:bg-accent transition-colors">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-7">
            {dayNames.map((d) => (
              <div key={d} className="border-b border-border px-2 py-2 text-center text-xs font-medium text-muted-foreground">
                {d}
              </div>
            ))}
            {days.map((day, i) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              return (
                <div
                  key={i}
                  className={`min-h-[100px] border-b border-r border-border p-1.5 ${!day ? "bg-muted/30" : "hover:bg-accent/30 transition-colors"}`}
                >
                  {day && (
                    <>
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                        isToday(day) ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground"
                      }`}>
                        {day}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {dayEvents.slice(0, 3).map((evt) => {
                          const style = categoryStyles[evt.category];
                          return (
                            <button
                              key={evt.id}
                              onClick={() => setSelectedEvent(evt)}
                              className={`w-full truncate rounded px-1 py-0.5 text-left text-[10px] ${style.bg} ${style.text} hover:opacity-80 transition-opacity`}
                            >
                              {evt.time && <span className="font-medium">{evt.time} </span>}
                              {evt.title}
                            </button>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <span className="text-[10px] text-muted-foreground px-1">+{dayEvents.length - 3} more</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
            <div className="w-full max-w-sm rounded-lg border border-border bg-card p-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">{selectedEvent.title}</h3>
                  <span className={`text-xs ${categoryStyles[selectedEvent.category].text}`}>
                    {categoryStyles[selectedEvent.category].label}
                  </span>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Date: {selectedEvent.date}</p>
                {selectedEvent.time && <p>Time: {selectedEvent.time}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
