import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:kadsjfbhdalkjbfadjklsbfasugdfuw@db.yxonqvdlwvxumkoumbhg.supabase.co:5432/postgres';

const client = new Client({
    connectionString,
});

async function setup() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const createMessagesTable = `
      CREATE TABLE IF NOT EXISTS messages (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        session_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        cards JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

        await client.query(createMessagesTable);
        console.log('Created messages table (if not exists).');

        // Index on session_id for faster lookups
        await client.query(`CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);`);
        console.log('Created index on session_id.');

    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        await client.end();
    }
}

setup();
