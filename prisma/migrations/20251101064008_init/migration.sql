-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- DropIndex
DROP INDEX "public"."User_username_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post_Categories" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Post_Categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post_Categories" ADD CONSTRAINT "Post_Categories_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post_Categories" ADD CONSTRAINT "Post_Categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
