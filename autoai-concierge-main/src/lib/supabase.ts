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

// Get all unique chat sessions with preview
export async function getChatSessions() {
    if (!supabase) return [];

    // Fetch all messages, grouped by session
    const { data, error } = await supabase
        .from('messages')
        .select('session_id, content, role, created_at')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching sessions:', error);
        return [];
    }

    // Group by session_id and get first user message as preview
    const sessionsMap = new Map<string, { session_id: string; preview: string; created_at: string }>();

    for (const msg of data || []) {
        if (!sessionsMap.has(msg.session_id)) {
            // First message of this session - use as timestamp reference
            sessionsMap.set(msg.session_id, {
                session_id: msg.session_id,
                preview: msg.role === 'user' ? msg.content : 'New conversation',
                created_at: msg.created_at
            });
        } else if (msg.role === 'user' && sessionsMap.get(msg.session_id)?.preview === 'New conversation') {
            // Update preview with first user message
            const existing = sessionsMap.get(msg.session_id)!;
            existing.preview = msg.content;
        }
    }

    // Convert to array and sort by created_at descending (newest first)
    return Array.from(sessionsMap.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

