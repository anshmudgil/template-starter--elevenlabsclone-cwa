"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { format, isSameMonth, parseISO, startOfMonth } from "date-fns";
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
import { NativeSelect } from "@/components/ui/native-select";
import { useCalendarEvents, useCreateCalendarEvent } from "@/hooks/use-mission-control";

const CATEGORIES = ["meeting", "deep-work", "content", "personal", "other"] as const;

export default function CalendarPage() {
  const { data: events = [], isLoading } = useCalendarEvents();
  const createEvent = useCreateCalendarEvent();
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [eventTime, setEventTime] = useState("");
  const [category, setCategory] = useState<string>("meeting");

  const monthEvents = useMemo(
    () => events.filter((e) => isSameMonth(parseISO(e.event_date), cursor)),
    [events, cursor],
  );

  const submit = () => {
    const t = title.trim();
    if (!t) return;
    createEvent.mutate(
      {
        title: t,
        event_date: eventDate,
        event_time: eventTime.trim() || null,
        category,
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
        title="Calendar"
        description="Milestones and time blocks tied to Mission Control."
      />
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCursor(startOfMonth(new Date(cursor.getFullYear(), cursor.getMonth() - 1)))}>
              Previous
            </Button>
            <span className="text-sm font-medium tabular-nums">{format(cursor, "MMMM yyyy")}</span>
            <Button variant="outline" size="sm" onClick={() => setCursor(startOfMonth(new Date(cursor.getFullYear(), cursor.getMonth() + 1)))}>
              Next
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCursor(startOfMonth(new Date()))}>
              Today
            </Button>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="cal-title">Title</Label>
                  <Input id="cal-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="cal-date">Date</Label>
                    <Input
                      id="cal-date"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="cal-time">Time (optional)</Label>
                    <Input
                      id="cal-time"
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="cal-cat">Category</Label>
                  <NativeSelect
                    id="cal-cat"
                    className="w-full"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </NativeSelect>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submit} disabled={!title.trim() || createEvent.isPending}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading events…</p>
        ) : monthEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events this month.</p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {monthEvents.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-[7rem] text-sm tabular-nums text-muted-foreground">
                  {format(parseISO(e.event_date), "MMM d")}
                  {e.event_time ? ` · ${e.event_time}` : ""}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-foreground">{e.title}</div>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {e.category}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
