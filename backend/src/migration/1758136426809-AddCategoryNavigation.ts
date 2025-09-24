import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryNavigation1758136426809 implements MigrationInterface {
  name = 'AddCategoryNavigation1758136426809';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "navigation" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "link" character varying, CONSTRAINT "UQ_1fa6702ade4e5bc1e48a037d463" UNIQUE ("title"), CONSTRAINT "PK_a7c90881db5205ad8d6b86ffef7" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "navigation"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
