INSERT INTO users (email, password, name, role, deleted) 
VALUES ('admin@parentpearl.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Admin', 'ADMIN', false)
ON CONFLICT (email) DO NOTHING;

-- The password is 'admin123' encrypted with BCrypt 