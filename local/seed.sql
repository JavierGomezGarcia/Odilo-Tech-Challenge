-- Local development seed for odilo_tech_challenge
-- Usage:
-- psql -h localhost -p 5432 -U odilo -d odilo_tech_challenge -f local/seed.sql

BEGIN;

-- Reset in FK-safe order
DELETE FROM loan;
DELETE FROM library_user;
DELETE FROM book;

-- Books
INSERT INTO book (isbn, title, total_copies, available_copies, created_at, updated_at) VALUES
('9780132350884', 'Clean Code', 5, 4, '2026-05-01T09:00:00+00:00', '2026-05-01T09:00:00+00:00'),
('9780201633610', 'Design Patterns', 3, 2, '2026-05-01T09:05:00+00:00', '2026-05-01T09:05:00+00:00'),
('9780131103627', 'The C Programming Language', 4, 3, '2026-05-01T09:10:00+00:00', '2026-05-01T09:10:00+00:00'),
('9781491950357', 'Building Microservices', 2, 2, '2026-05-01T09:15:00+00:00', '2026-05-01T09:15:00+00:00'),
('9781617294945', 'Spring in Action', 6, 4, '2026-05-01T09:20:00+00:00', '2026-05-01T09:20:00+00:00');

-- Users
INSERT INTO library_user (full_name, email, created_at) VALUES
('Alice Martin', 'alice.martin@example.com', '2026-05-01T10:00:00+00:00'),
('Bruno Garcia', 'bruno.garcia@example.com', '2026-05-01T10:05:00+00:00'),
('Carla Lopez', 'carla.lopez@example.com', '2026-05-01T10:10:00+00:00'),
('David Chen', 'david.chen@example.com', '2026-05-01T10:15:00+00:00');

-- Loans
-- Active loans: actual_return_date is NULL, active = true
-- Returned loans: actual_return_date is set, active = false
INSERT INTO loan (user_id_card, book_isbn, expected_return_date, actual_return_date, active, created_at) VALUES
((SELECT id_card FROM library_user WHERE email = 'alice.martin@example.com'), '9780132350884', '2026-06-20T12:00:00+00:00', NULL, true, '2026-05-02T08:00:00+00:00'),
((SELECT id_card FROM library_user WHERE email = 'bruno.garcia@example.com'), '9780201633610', '2026-06-18T12:00:00+00:00', NULL, true, '2026-05-02T08:10:00+00:00'),
((SELECT id_card FROM library_user WHERE email = 'carla.lopez@example.com'), '9781617294945', '2026-06-25T12:00:00+00:00', NULL, true, '2026-05-02T08:20:00+00:00'),
((SELECT id_card FROM library_user WHERE email = 'david.chen@example.com'), '9780131103627', '2026-05-10T12:00:00+00:00', '2026-05-09T09:30:00+00:00', false, '2026-04-25T14:00:00+00:00'),
((SELECT id_card FROM library_user WHERE email = 'alice.martin@example.com'), '9781617294945', '2026-05-05T12:00:00+00:00', '2026-05-04T16:45:00+00:00', false, '2026-04-20T11:00:00+00:00'),
((SELECT id_card FROM library_user WHERE email = 'bruno.garcia@example.com'), '9780132350884', '2026-05-12T12:00:00+00:00', '2026-05-11T10:15:00+00:00', false, '2026-04-27T09:30:00+00:00');

COMMIT;
