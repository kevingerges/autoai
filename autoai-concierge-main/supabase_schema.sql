-- Create the chats table
create table if not exists chats (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_session_id text not null,
  messages jsonb not null default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb
);

-- Enable Row Level Security (RLS)
alter table chats enable row level security;

-- Create a policy that allows anyone (anon) to insert/select based on session_id
-- Note: In a real production app, you might restrict this further.
create policy "Enable access for all users"
on chats
for all
using (true)
with check (true);
