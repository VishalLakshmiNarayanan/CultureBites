-- Add status column to seat_requests table
ALTER TABLE seat_requests 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'waitlist'));

-- Add index for faster status queries
CREATE INDEX IF NOT EXISTS idx_seat_requests_status ON seat_requests(status);
CREATE INDEX IF NOT EXISTS idx_seat_requests_event_status ON seat_requests(event_id, status);
