create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('mother', 'child')),
  family_id uuid not null,
  name text not null,
  coins integer not null default 0 check (coins >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null,
  title text not null,
  details text,
  assignee_id uuid not null references public.profiles(id) on delete cascade,
  deadline timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null,
  title text not null,
  cost integer not null check (cost > 0),
  created_at timestamptz not null default now()
);

create index if not exists profiles_family_id_idx on public.profiles(family_id);
create index if not exists tasks_family_id_idx on public.tasks(family_id);
create index if not exists tasks_assignee_id_idx on public.tasks(assignee_id);
create index if not exists rewards_family_id_idx on public.rewards(family_id);

create or replace function public.current_family_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select family_id from public.profiles where id = auth.uid()
$$;

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.rewards enable row level security;

drop policy if exists "profiles_select_family" on public.profiles;
create policy "profiles_select_family"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or (
    public.current_profile_role() = 'mother'
    and family_id = public.current_family_id()
  )
);

drop policy if exists "tasks_select_by_role" on public.tasks;
create policy "tasks_select_by_role"
on public.tasks
for select
to authenticated
using (
  family_id = public.current_family_id()
  and (
    public.current_profile_role() = 'mother'
    or assignee_id = auth.uid()
  )
);

drop policy if exists "tasks_insert_by_mother" on public.tasks;
create policy "tasks_insert_by_mother"
on public.tasks
for insert
to authenticated
with check (
  public.current_profile_role() = 'mother'
  and family_id = public.current_family_id()
  and exists (
    select 1
    from public.profiles child
    where child.id = assignee_id
      and child.family_id = public.current_family_id()
      and child.role = 'child'
  )
);

drop policy if exists "rewards_select_family" on public.rewards;
create policy "rewards_select_family"
on public.rewards
for select
to authenticated
using (family_id = public.current_family_id());

drop policy if exists "rewards_insert_by_mother" on public.rewards;
create policy "rewards_insert_by_mother"
on public.rewards
for insert
to authenticated
with check (
  public.current_profile_role() = 'mother'
  and family_id = public.current_family_id()
);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
grant select, insert, update, delete on public.rewards to authenticated;
