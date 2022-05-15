-- CreateEnum
CREATE TYPE "DepartmentType" AS ENUM ('GEOLOGY', 'KITCHEN', 'DRILLERS', 'CONSTRUCTION');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" "DepartmentType";

-- DropEnum
DROP TYPE "UserType";
