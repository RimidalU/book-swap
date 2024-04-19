import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1713521419504 implements MigrationInterface {
  name = 'Migrations1713521419504'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "avatar" TO "avatarId"`,
    )
    await queryRunner.query(
      `CREATE TABLE "databaseFile" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "data" bytea NOT NULL, CONSTRAINT "PK_9c770ea755d5935069bf46f4f3b" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "file" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "data" bytea NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarId"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "avatarId" integer`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_58f5c71eaab331645112cf8cfa5" UNIQUE ("avatarId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5" FOREIGN KEY ("avatarId") REFERENCES "databaseFile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_58f5c71eaab331645112cf8cfa5"`,
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarId"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "avatarId" text`)
    await queryRunner.query(`DROP TABLE "file"`)
    await queryRunner.query(`DROP TABLE "databaseFile"`)
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "avatarId" TO "avatar"`,
    )
  }
}
