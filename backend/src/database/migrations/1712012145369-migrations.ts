import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1712012145369 implements MigrationInterface {
  name = 'Migrations1712012145369'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book" ADD "likes" smallint NOT NULL DEFAULT '0'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "likes"`)
  }
}
