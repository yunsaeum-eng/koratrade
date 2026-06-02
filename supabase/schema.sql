-- KoraTrade schema
-- Run this in Supabase Dashboard > SQL Editor

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  avatar text,
  avatar_bg text,
  avatar_gender text default 'female',
  goal text,
  level integer default 1,
  xp integer default 0,
  title text default 'Intern',
  job_goal text,
  english_level text default 'beginner',
  industry text,
  learning_reason text,
  created_at timestamp with time zone default now()
);

create table public.game_state (
  id uuid references auth.users on delete cascade primary key,
  data jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
alter table public.game_state enable row level security;

create policy "Users can manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users can manage own game_state" on public.game_state for all using (auth.uid() = id);
