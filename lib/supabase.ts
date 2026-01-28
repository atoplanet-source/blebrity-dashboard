import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let supabaseInstance: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  if (!supabaseInstance) {
    throw new Error('Supabase client not initialized - check environment variables')
  }
  return supabaseInstance
}

// For backwards compatibility
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as unknown as SupabaseClient

export type Player = {
  id: string
  device_id: string
  username: string | null
  created_at: string
  last_seen: string | null
  total_points: number
}

export type Session = {
  id: string
  player_id: string
  started_at: string
  ended_at: string | null
  duration_seconds: number | null
}

export type GameResult = {
  id: string
  player_id: string
  session_id: string
  game_type: 'homeschooled' | 'whosthat'
  played_at: string
  score: number
  duration_seconds: number | null
  details: Record<string, unknown>
}

export type Event = {
  id: string
  player_id: string
  session_id: string | null
  event_type: string
  event_data: Record<string, unknown>
  created_at: string
}
