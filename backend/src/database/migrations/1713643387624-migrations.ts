import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1713643387624 implements MigrationInterface {
  name = 'Migrations1713643387624'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "databaseFile" ADD "url" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "databaseFile" ALTER COLUMN "data" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "databaseFile" ALTER COLUMN "data" DROP NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "databaseFile" ALTER COLUMN "data" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "databaseFile" ALTER COLUMN "data" SET NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "databaseFile" DROP COLUMN "url"`)
  }
}
