/*
  Warnings:

  - Added the required column `name` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Project` ADD COLUMN `name` VARCHAR(225) NOT NULL,
    MODIFY `content` LONGTEXT NOT NULL;
