import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1713640405643 implements MigrationInterface {
  name = 'Migrations1713640405643'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "book" ADD "ebookId" integer`)
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "UQ_b866ee69f20200dca51403b65fb" UNIQUE ("ebookId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "FK_b866ee69f20200dca51403b65fb" FOREIGN KEY ("ebookId") REFERENCES "databaseFile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "FK_b866ee69f20200dca51403b65fb"`,
    )
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "UQ_b866ee69f20200dca51403b65fb"`,
    )
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "ebookId"`)
  }
}
