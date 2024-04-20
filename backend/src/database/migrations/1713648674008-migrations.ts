import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1713648674008 implements MigrationInterface {
  name = 'Migrations1713648674008'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "databaseFile" ADD "mimetype" character varying`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "databaseFile" DROP COLUMN "mimetype"`)
  }
}
