/*
  Warnings:

  - Added the required column `contentHash` to the `embedding_chunks` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_embedding_chunks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "embedding" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "contentHash" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "embedding_chunks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_embedding_chunks" ("content", "createdAt", "embedding", "id", "projectId", "sourceId", "sourceType", "updatedAt") SELECT "content", "createdAt", "embedding", "id", "projectId", "sourceId", "sourceType", "updatedAt" FROM "embedding_chunks";
DROP TABLE "embedding_chunks";
ALTER TABLE "new_embedding_chunks" RENAME TO "embedding_chunks";
CREATE INDEX "embedding_chunks_projectId_sourceType_idx" ON "embedding_chunks"("projectId", "sourceType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
