import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1712821921248 implements MigrationInterface {
  name = 'Migrations1712821921248'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_subscriptions_user" ("userId_1" integer NOT NULL, "userId_2" integer NOT NULL, CONSTRAINT "PK_834a53b6f0d7658b717b06a42f8" PRIMARY KEY ("userId_1", "userId_2"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_aceed9a6aa281dcc48fc905487" ON "user_subscriptions_user" ("userId_1") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_14b1f885b7d460dce04c544d0a" ON "user_subscriptions_user" ("userId_2") `,
    )
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions_user" ADD CONSTRAINT "FK_aceed9a6aa281dcc48fc9054870" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions_user" ADD CONSTRAINT "FK_14b1f885b7d460dce04c544d0a5" FOREIGN KEY ("userId_2") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions_user" DROP CONSTRAINT "FK_14b1f885b7d460dce04c544d0a5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions_user" DROP CONSTRAINT "FK_aceed9a6aa281dcc48fc9054870"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_14b1f885b7d460dce04c544d0a"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_aceed9a6aa281dcc48fc905487"`,
    )
    await queryRunner.query(`DROP TABLE "user_subscriptions_user"`)
  }
}
