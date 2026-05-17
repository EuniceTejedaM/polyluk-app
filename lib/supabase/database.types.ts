export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          detail: string | null
          device_id: string | null
          dog_id: string
          id: string
          occurred_at: string
          owner_id: string
          resolved_at: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          title: string
          type: Database["public"]["Enums"]["alert_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          device_id?: string | null
          dog_id: string
          id?: string
          occurred_at?: string
          owner_id: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          title: string
          type: Database["public"]["Enums"]["alert_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          device_id?: string | null
          dog_id?: string
          id?: string
          occurred_at?: string
          owner_id?: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          title?: string
          type?: Database["public"]["Enums"]["alert_type"]
          updated_at?: string
        }
      }
      devices: {
        Row: {
          assigned_user_id: string | null
          battery_level: number
          code: string
          created_at: string
          id: string
          label: string | null
          last_seen_at: string | null
          latitude: number | null
          longitude: number | null
          model: string
          paired_at: string | null
          signal_strength: number | null
          status: Database["public"]["Enums"]["device_status"]
          updated_at: string
        }
        Insert: {
          assigned_user_id?: string | null
          battery_level?: number
          code: string
          created_at?: string
          id?: string
          label?: string | null
          last_seen_at?: string | null
          latitude?: number | null
          longitude?: number | null
          model?: string
          paired_at?: string | null
          signal_strength?: number | null
          status?: Database["public"]["Enums"]["device_status"]
          updated_at?: string
        }
        Update: {
          assigned_user_id?: string | null
          battery_level?: number
          code?: string
          created_at?: string
          id?: string
          label?: string | null
          last_seen_at?: string | null
          latitude?: number | null
          longitude?: number | null
          model?: string
          paired_at?: string | null
          signal_strength?: number | null
          status?: Database["public"]["Enums"]["device_status"]
          updated_at?: string
        }
      }
      dog_locations: {
        Row: {
          accuracy_meters: number | null
          device_id: string | null
          dog_id: string
          id: string
          latitude: number
          longitude: number
          owner_id: string
          recorded_at: string
          source: string
        }
        Insert: {
          accuracy_meters?: number | null
          device_id?: string | null
          dog_id: string
          id?: string
          latitude: number
          longitude: number
          owner_id: string
          recorded_at?: string
          source?: string
        }
        Update: {
          accuracy_meters?: number | null
          device_id?: string | null
          dog_id?: string
          id?: string
          latitude?: number
          longitude?: number
          owner_id?: string
          recorded_at?: string
          source?: string
        }
      }
      dogs: {
        Row: {
          battery_level: number
          birth_date: string | null
          breed: string | null
          created_at: string
          device_id: string | null
          heart_rate: number
          id: string
          last_seen_at: string | null
          latitude: number | null
          location_accuracy_meters: number | null
          longitude: number | null
          name: string
          next_medical_review: string | null
          notes: string | null
          owner_id: string
          oxygen_saturation: number
          photo_path: string | null
          respiration_rate: number
          sex: string | null
          status: Database["public"]["Enums"]["dog_status"]
          temperature: number
          updated_at: string
        }
        Insert: {
          battery_level?: number
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          device_id?: string | null
          heart_rate?: number
          id?: string
          last_seen_at?: string | null
          latitude?: number | null
          location_accuracy_meters?: number | null
          longitude?: number | null
          name: string
          next_medical_review?: string | null
          notes?: string | null
          owner_id: string
          oxygen_saturation?: number
          photo_path?: string | null
          respiration_rate?: number
          sex?: string | null
          status?: Database["public"]["Enums"]["dog_status"]
          temperature?: number
          updated_at?: string
        }
        Update: {
          battery_level?: number
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          device_id?: string | null
          heart_rate?: number
          id?: string
          last_seen_at?: string | null
          latitude?: number | null
          location_accuracy_meters?: number | null
          longitude?: number | null
          name?: string
          next_medical_review?: string | null
          notes?: string | null
          owner_id?: string
          oxygen_saturation?: number
          photo_path?: string | null
          respiration_rate?: number
          sex?: string | null
          status?: Database["public"]["Enums"]["dog_status"]
          temperature?: number
          updated_at?: string
        }
      }
      medical_events: {
        Row: {
          created_at: string
          description: string | null
          dog_id: string
          event_date: string
          event_type: Database["public"]["Enums"]["medical_event_type"]
          id: string
          owner_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          dog_id: string
          event_date: string
          event_type?: Database["public"]["Enums"]["medical_event_type"]
          id?: string
          owner_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          dog_id?: string
          event_date?: string
          event_type?: Database["public"]["Enums"]["medical_event_type"]
          id?: string
          owner_id?: string
          title?: string
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      alert_severity: "info" | "warning" | "critical"
      alert_type: "health" | "location" | "battery" | "connectivity" | "device"
      device_status: "available" | "paired" | "offline" | "maintenance"
      dog_status: "active" | "inactive" | "sick" | "missing"
      medical_event_type:
        | "veterinary_visit"
        | "vaccination"
        | "illness"
        | "medication"
        | "surgery"
        | "test"
        | "other"
    }
    CompositeTypes: Record<string, never>
  }
}