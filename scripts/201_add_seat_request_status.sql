-- Add status column to seat_requests table
alter table public.seat_requests 
add column if not exists status text not null default 'pending';

-- Add policy for updating seat requests
drop policy if exists "anon update seats" on public.seat_requests;
create policy "anon update seats" on public.seat_requests for update using (true);

-- Add index for better query performance
create index if not exists idx_seat_status on public.seat_requests(status);
