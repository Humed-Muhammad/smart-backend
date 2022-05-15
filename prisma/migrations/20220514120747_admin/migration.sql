-- CreateEnum
CREATE TYPE "AdminType" AS ENUM ('SUPER', 'VOTE_MANAGER', 'DEPARTMENT_LEADER', 'REGULAR');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "role" "AdminType";

-- DropEnum
DROP TYPE "ImageType";
