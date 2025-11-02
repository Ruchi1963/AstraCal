-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "color" TEXT DEFAULT '#2C82F6',
    "allDay" BOOLEAN NOT NULL DEFAULT false,
    "startUTC" DATETIME NOT NULL,
    "endUTC" DATETIME NOT NULL,
    "timezone" TEXT DEFAULT 'UTC',
    "rrule" TEXT,
    "exdatesUTC" TEXT DEFAULT '[]',
    "seriesId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
