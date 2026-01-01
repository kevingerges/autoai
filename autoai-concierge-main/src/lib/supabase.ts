import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key missing. Persistence disabled.')
}

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export async function getMessages(sessionId: string) {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
    return data || [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveMessage(sessionId: string, role: string, content: string, cards: any = null) {
    if (!supabase) return;

    const { error } = await supabase
        .from('messages')
        .insert([
            {
                session_id: sessionId,
                role,
                content,
                cards
            }
        ]);

    if (error) {
        console.error('Error saving message:', error);
    }
}
