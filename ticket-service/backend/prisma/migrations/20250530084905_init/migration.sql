-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "verification_code" TEXT,
    "verified_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "seats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event_id" TEXT NOT NULL,
    "seat_number" TEXT NOT NULL,
    "is_reserved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "seats_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event_id" TEXT NOT NULL,
    "seat_id" TEXT NOT NULL,
    "user_id" TEXT,
    "guest_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'RESERVED',
    "reserved_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelled_at" DATETIME,
    "refunded_at" DATETIME,
    CONSTRAINT "tickets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tickets_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tickets_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "refund_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticket_id" TEXT NOT NULL,
    "requested_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approved_at" DATETIME,
    "reason" TEXT,
    CONSTRAINT "refund_requests_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "seats_event_id_seat_number_key" ON "seats"("event_id", "seat_number");
