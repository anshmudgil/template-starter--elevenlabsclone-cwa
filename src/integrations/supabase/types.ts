export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      activity_events: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          agent_name: string;
          status: string;
          message: string;
          metadata: Json;
          source: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          agent_name?: string;
          status?: string;
          message: string;
          metadata?: Json;
          source?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          agent_name?: string;
          status?: string;
          message?: string;
          metadata?: Json;
          source?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activity_events_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      agents: {
        Row: {
          id: string;
          user_id: string;
          slug: string;
          name: string;
          role: string | null;
          group_name: string;
          current_task: string;
          status: string;
          last_active_at: string | null;
          responsibilities: Json;
          metrics: Json;
          sort_order: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          slug: string;
          name: string;
          role?: string | null;
          group_name: string;
          current_task?: string;
          status?: string;
          last_active_at?: string | null;
          responsibilities?: Json;
          metrics?: Json;
          sort_order?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          slug?: string;
          name?: string;
          role?: string | null;
          group_name?: string;
          current_task?: string;
          status?: string;
          last_active_at?: string | null;
          responsibilities?: Json;
          metrics?: Json;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "agents_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          column_id: string;
          sort_order: number;
          title: string;
          assignee: string;
          priority: string;
          due_date: string | null;
          project: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          column_id: string;
          sort_order?: number;
          title: string;
          assignee: string;
          priority: string;
          due_date?: string | null;
          project: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          column_id?: string;
          sort_order?: number;
          title?: string;
          assignee?: string;
          priority?: string;
          due_date?: string | null;
          project?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      calendar_events: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          event_date: string;
          event_time: string | null;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          event_date: string;
          event_time?: string | null;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          event_date?: string;
          event_time?: string | null;
          category?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "calendar_events_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      content_items: {
        Row: {
          id: string;
          user_id: string;
          column_id: string;
          sort_order: number;
          title: string;
          platform: string;
          day_label: string | null;
          status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          column_id: string;
          sort_order?: number;
          title: string;
          platform: string;
          day_label?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          column_id?: string;
          sort_order?: number;
          title?: string;
          platform?: string;
          day_label?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_items_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          role: string | null;
          category: string;
          email: string | null;
          slack: string | null;
          linkedin: string | null;
          timezone: string | null;
          compensation: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          role?: string | null;
          category: string;
          email?: string | null;
          slack?: string | null;
          linkedin?: string | null;
          timezone?: string | null;
          compensation?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          role?: string | null;
          category?: string;
          email?: string | null;
          slack?: string | null;
          linkedin?: string | null;
          timezone?: string | null;
          compensation?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contacts_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      memories: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string;
          preview: string | null;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          category: string;
          preview?: string | null;
          content?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          category?: string;
          preview?: string | null;
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "memories_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      integrations: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          status: string;
          last_sync_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          status?: string;
          last_sync_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          status?: string;
          last_sync_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "integrations_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      cron_jobs: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          schedule_human: string | null;
          status: string;
          last_run_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          schedule_human?: string | null;
          status?: string;
          last_run_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          schedule_human?: string | null;
          status?: string;
          last_run_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "cron_jobs_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      agent_settings: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          value: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          value: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: "agent_settings_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      ensure_mission_seed: {
        Args: { p_user_id: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type DatabaseWithoutInternals = Database;

type DefaultSchema = DatabaseWithoutInternals["public"];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
