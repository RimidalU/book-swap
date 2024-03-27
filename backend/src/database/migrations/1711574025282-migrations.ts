import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1711574025282 implements MigrationInterface {
  name = 'Migrations1711574025282'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "book" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "author" character varying NOT NULL, "year" smallint, "description" text, "condition" smallint NOT NULL, "owner" integer NOT NULL, "isBorrowed" boolean NOT NULL DEFAULT false, "borrower" integer, "borrowersQueue" integer array NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "borrowersQueue"`)
    await queryRunner.query(`ALTER TABLE "book" ADD "borrowersQueue" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "borrowersQueue"`)
    await queryRunner.query(
      `ALTER TABLE "book" ADD "borrowersQueue" integer array NOT NULL`,
    )
    await queryRunner.query(`DROP TABLE "book"`)
  }
}
