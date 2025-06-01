-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_seats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event_id" TEXT NOT NULL,
    "seat_number" TEXT NOT NULL,
    "price" REAL NOT NULL DEFAULT 10000,
    "is_reserved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "seats_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_seats" ("created_at", "event_id", "id", "is_reserved", "seat_number") SELECT "created_at", "event_id", "id", "is_reserved", "seat_number" FROM "seats";
DROP TABLE "seats";
ALTER TABLE "new_seats" RENAME TO "seats";
CREATE UNIQUE INDEX "seats_event_id_seat_number_key" ON "seats"("event_id", "seat_number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
