-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[];
