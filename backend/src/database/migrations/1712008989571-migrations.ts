import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1712008989571 implements MigrationInterface {
    name = 'Migrations1712008989571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_favorites_book" ("userId" integer NOT NULL, "bookId" integer NOT NULL, CONSTRAINT "PK_e0eaaa12316f010063703bbe45f" PRIMARY KEY ("userId", "bookId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_15e7a80738b0498b20664e8acb" ON "user_favorites_book" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c2392353afdfa944b152b15921" ON "user_favorites_book" ("bookId") `);
        await queryRunner.query(`ALTER TABLE "user_favorites_book" ADD CONSTRAINT "FK_15e7a80738b0498b20664e8acbe" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favorites_book" ADD CONSTRAINT "FK_c2392353afdfa944b152b15921b" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorites_book" DROP CONSTRAINT "FK_c2392353afdfa944b152b15921b"`);
        await queryRunner.query(`ALTER TABLE "user_favorites_book" DROP CONSTRAINT "FK_15e7a80738b0498b20664e8acbe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c2392353afdfa944b152b15921"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_15e7a80738b0498b20664e8acb"`);
        await queryRunner.query(`DROP TABLE "user_favorites_book"`);
    }

}
