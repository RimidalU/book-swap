import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1714207508855 implements MigrationInterface {
  name = 'Migrations1714207508855'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "borrower"`)
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "borrowersQueue"`)
    await queryRunner.query(`ALTER TABLE "book" ADD "borrowerId" integer`)
    await queryRunner.query(
      `ALTER TABLE "book" ADD "borrowersIdsQueue" integer array NOT NULL DEFAULT '{}'`,
    )
    await queryRunner.query(`ALTER TABLE "book" ADD "userId" integer`)
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "UQ_04f66cf2a34f8efc5dcd9803693" UNIQUE ("userId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "FK_04f66cf2a34f8efc5dcd9803693" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "FK_04f66cf2a34f8efc5dcd9803693"`,
    )
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "UQ_04f66cf2a34f8efc5dcd9803693"`,
    )
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "userId"`)
    await queryRunner.query(
      `ALTER TABLE "book" DROP COLUMN "borrowersIdsQueue"`,
    )
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "borrowerId"`)
    await queryRunner.query(
      `ALTER TABLE "book" ADD "borrowersQueue" integer array NOT NULL DEFAULT '{}'`,
    )
    await queryRunner.query(`ALTER TABLE "book" ADD "borrower" integer`)
  }
}
