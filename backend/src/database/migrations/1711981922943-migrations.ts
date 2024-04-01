import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1711981922943 implements MigrationInterface {
  name = 'Migrations1711981922943'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "book" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "author" character varying NOT NULL, "year" smallint, "description" text, "condition" smallint NOT NULL, "isBorrowed" boolean NOT NULL DEFAULT false, "borrower" integer, "borrowersQueue" integer array NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" integer, CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "bio" text, "avatar" text, "email" character varying NOT NULL, "password" character varying NOT NULL, "token" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "FK_b90677e3d515d915033134fc5f4" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "FK_b90677e3d515d915033134fc5f4"`,
    )
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "book"`)
  }
}
