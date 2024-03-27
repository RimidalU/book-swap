import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1711547376552 implements MigrationInterface {
    name = 'Migrations1711547376552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "borrowersQueue" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "borrowersQueue" SET DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "borrowersQueue" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "book" ALTER COLUMN "borrowersQueue" DROP DEFAULT`);
    }

}
