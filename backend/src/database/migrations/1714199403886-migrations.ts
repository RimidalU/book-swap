import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1714199403886 implements MigrationInterface {
  name = 'Migrations1714199403886'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_requested_books_book" ("userId" integer NOT NULL, "bookId" integer NOT NULL, CONSTRAINT "PK_bc722ae826698d630b7bdd9e62a" PRIMARY KEY ("userId", "bookId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_518fca093c9fd2fe02e9ab1dfd" ON "user_requested_books_book" ("userId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_642bcbb9a3b92ce3b8af444ea5" ON "user_requested_books_book" ("bookId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "user_requested_books_book" ADD CONSTRAINT "FK_518fca093c9fd2fe02e9ab1dfd2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_requested_books_book" ADD CONSTRAINT "FK_642bcbb9a3b92ce3b8af444ea58" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_requested_books_book" DROP CONSTRAINT "FK_642bcbb9a3b92ce3b8af444ea58"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_requested_books_book" DROP CONSTRAINT "FK_518fca093c9fd2fe02e9ab1dfd2"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_642bcbb9a3b92ce3b8af444ea5"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_518fca093c9fd2fe02e9ab1dfd"`,
    )
    await queryRunner.query(`DROP TABLE "user_requested_books_book"`)
  }
}
