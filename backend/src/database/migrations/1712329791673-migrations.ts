import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1712329791673 implements MigrationInterface {
  name = 'Migrations1712329791673'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "book" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "author" character varying NOT NULL, "year" smallint, "description" text, "condition" smallint NOT NULL, "isBorrowed" boolean NOT NULL DEFAULT false, "borrower" integer, "borrowersQueue" integer array NOT NULL DEFAULT '{}', "likes" smallint NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" integer, CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "bio" text, "avatar" text, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "user_favorites_book" ("userId" integer NOT NULL, "bookId" integer NOT NULL, CONSTRAINT "PK_e0eaaa12316f010063703bbe45f" PRIMARY KEY ("userId", "bookId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_15e7a80738b0498b20664e8acb" ON "user_favorites_book" ("userId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c2392353afdfa944b152b15921" ON "user_favorites_book" ("bookId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "FK_b90677e3d515d915033134fc5f4" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_favorites_book" ADD CONSTRAINT "FK_15e7a80738b0498b20664e8acbe" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_favorites_book" ADD CONSTRAINT "FK_c2392353afdfa944b152b15921b" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_favorites_book" DROP CONSTRAINT "FK_c2392353afdfa944b152b15921b"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_favorites_book" DROP CONSTRAINT "FK_15e7a80738b0498b20664e8acbe"`,
    )
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "FK_b90677e3d515d915033134fc5f4"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c2392353afdfa944b152b15921"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_15e7a80738b0498b20664e8acb"`,
    )
    await queryRunner.query(`DROP TABLE "user_favorites_book"`)
    await queryRunner.query(`DROP TABLE "tag"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "book"`)
  }
}
