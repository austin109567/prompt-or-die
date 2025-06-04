export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          handle: string
          created_at: string | null
        }
        Insert: {
          id: string
          email: string
          handle: string
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          handle?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          id: string
          name: string
          user_id: string
          last_modified: string | null
        }
        Insert: {
          id: string
          name: string
          user_id: string
          last_modified?: string | null
        }
        Update: {
          id?: string
          name?: string
          user_id?: string
          last_modified?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      prompt_blocks: {
        Row: {
          id: string
          project_id: string
          type: string
          label: string
          value: string
          order: number
        }
        Insert: {
          id: string
          project_id: string
          type: string
          label: string
          value: string
          order: number
        }
        Update: {
          id?: string
          project_id?: string
          type?: string
          label?: string
          value?: string
          order?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompt_blocks_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      personas: {
        Row: {
          id: string
          name: string
          traits: string[]
          tone_blocks: string[]
          created_by: string | null
        }
        Insert: {
          id: string
          name: string
          traits: string[]
          tone_blocks: string[]
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          traits?: string[]
          tone_blocks?: string[]
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personas_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      exports: {
        Row: {
          id: string
          project_id: string
          format: string
          content: string
          created_at: string | null
        }
        Insert: {
          id: string
          project_id: string
          format: string
          content: string
          created_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          format?: string
          content?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exports_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}