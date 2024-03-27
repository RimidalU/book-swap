import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1711475205960 implements MigrationInterface {
  name = 'Migrations1711475205960'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "book" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "author" character varying NOT NULL, "year" smallint, "description" text, "condition" smallint NOT NULL, "owner" integer NOT NULL, "isBorrowed" boolean NOT NULL DEFAULT false, "borrower" integer, "borrowersQueue" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "book"`)
  }
}
