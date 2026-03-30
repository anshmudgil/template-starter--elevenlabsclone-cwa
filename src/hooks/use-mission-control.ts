import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useMissionSupabase } from "@/providers/mission-supabase-provider";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export const TASK_COLUMNS = ["backlog", "inProgress", "review", "done"] as const;
export type TaskColumnId = (typeof TASK_COLUMNS)[number];

export const CONTENT_COLUMNS = [
  "idea",
  "scripting",
  "recording",
  "editing",
  "review",
  "scheduled",
  "published",
] as const;
export type ContentColumnId = (typeof CONTENT_COLUMNS)[number];

const TASK_COLUMN_TITLE: Record<TaskColumnId, string> = {
  backlog: "Backlog",
  inProgress: "In Progress",
  review: "Review / QA",
  done: "Done",
};

const CONTENT_COLUMN_TITLE: Record<ContentColumnId, string> = {
  idea: "Idea",
  scripting: "Scripting",
  recording: "Recording / Drafting",
  editing: "Editing",
  review: "Review",
  scheduled: "Scheduled",
  published: "Published",
};

export function taskColumnTitle(id: string): string {
  return TASK_COLUMN_TITLE[id as TaskColumnId] ?? id;
}

export function contentColumnTitle(id: string): string {
  return CONTENT_COLUMN_TITLE[id as ContentColumnId] ?? id;
}

export function useMissionProfile() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId!).single();
      if (error) throw error;
      return data;
    },
  });
}

export function useActivityFeed(limit = 80) {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  const qc = useQueryClient();

  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`activity:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_events",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void qc.invalidateQueries({ queryKey: ["activities", userId] });
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [userId, qc, supabase]);

  return useQuery({
    queryKey: ["activities", userId, limit],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_events")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    },
  });
}

export function useTasks() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  return useQuery({
    queryKey: ["tasks", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId!)
        .order("column_id")
        .order("sort_order");
      if (error) throw error;
      return data as Tables<"tasks">[];
    },
  });
}

export function useUpsertTasksOrder() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Pick<Tables<"tasks">, "id" | "column_id" | "sort_order">[]) => {
      for (const u of updates) {
        const { error } = await supabase
          .from("tasks")
          .update({ column_id: u.column_id, sort_order: u.sort_order })
          .eq("id", u.id)
          .eq("user_id", userId!);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tasks", userId] });
    },
  });
}

export function useCreateTask() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Omit<TablesInsert<"tasks">, "user_id">) => {
      const { error } = await supabase.from("tasks").insert({ ...row, user_id: userId! });
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tasks", userId] });
    },
  });
}

export function useAgents() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  return useQuery({
    queryKey: ["agents", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("user_id", userId!)
        .order("group_name")
        .order("sort_order");
      if (error) throw error;
      return data as Tables<"agents">[];
    },
  });
}

export function useIntegrations() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  return useQuery({
    queryKey: ["integrations", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("integrations").select("*").eq("user_id", userId!);
      if (error) throw error;
      return data as Tables<"integrations">[];
    },
  });
}

export function useUpdateIntegration() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: TablesUpdate<"integrations"> }) => {
      const { error } = await supabase
        .from("integrations")
        .update(patch)
        .eq("id", id)
        .eq("user_id", userId!);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["integrations", userId] });
    },
  });
}

export function useCronJobs() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  return useQuery({
    queryKey: ["cron_jobs", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("cron_jobs").select("*").eq("user_id", userId!);
      if (error) throw error;
      return data as Tables<"cron_jobs">[];
    },
  });
}

export function useUpdateCronJob() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: TablesUpdate<"cron_jobs"> }) => {
      const { error } = await supabase.from("cron_jobs").update(patch).eq("id", id).eq("user_id", userId!);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["cron_jobs", userId] });
    },
  });
}

export function useAgentSettingsRows() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  return useQuery({
    queryKey: ["agent_settings", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("agent_settings").select("*").eq("user_id", userId!);
      if (error) throw error;
      return data as Tables<"agent_settings">[];
    },
  });
}

export function useCalendarEvents() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  return useQuery({
    queryKey: ["calendar_events", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", userId!)
        .order("event_date");
      if (error) throw error;
      return data as Tables<"calendar_events">[];
    },
  });
}

export function useCreateCalendarEvent() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Omit<TablesInsert<"calendar_events">, "user_id">) => {
      const { error } = await supabase.from("calendar_events").insert({ ...row, user_id: userId! });
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["calendar_events", userId] });
    },
  });
}

export function useContentItems() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  return useQuery({
    queryKey: ["content_items", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .eq("user_id", userId!)
        .order("column_id")
        .order("sort_order");
      if (error) throw error;
      return data as Tables<"content_items">[];
    },
  });
}

export function useUpsertContentOrder() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Pick<Tables<"content_items">, "id" | "column_id" | "sort_order">[]) => {
      for (const u of updates) {
        const { error } = await supabase
          .from("content_items")
          .update({ column_id: u.column_id, sort_order: u.sort_order, status: u.column_id })
          .eq("id", u.id)
          .eq("user_id", userId!);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["content_items", userId] });
    },
  });
}

export function useCreateContentItem() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Omit<TablesInsert<"content_items">, "user_id">) => {
      const { error } = await supabase.from("content_items").insert({ ...row, user_id: userId! });
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["content_items", userId] });
    },
  });
}

export function useContacts() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  return useQuery({
    queryKey: ["contacts", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("contacts").select("*").eq("user_id", userId!);
      if (error) throw error;
      return data as Tables<"contacts">[];
    },
  });
}

export function useCreateContact() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Omit<TablesInsert<"contacts">, "user_id">) => {
      const { error } = await supabase.from("contacts").insert({ ...row, user_id: userId! });
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["contacts", userId] });
    },
  });
}

export function useMemories() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  return useQuery({
    queryKey: ["memories", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Tables<"memories">[];
    },
  });
}

export function useCreateMemory() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Omit<TablesInsert<"memories">, "user_id">) => {
      const { error } = await supabase.from("memories").insert({ ...row, user_id: userId! });
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["memories", userId] });
    },
  });
}

export function useUpdateAgentSetting() {
  const { userId } = useAuth();
  const supabase = useMissionSupabase();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) => {
      const { error } = await supabase
        .from("agent_settings")
        .update({ value })
        .eq("id", id)
        .eq("user_id", userId!);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["agent_settings", userId] });
    },
  });
}
