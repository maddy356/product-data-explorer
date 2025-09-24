import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1758136067323 implements MigrationInterface {
  name = 'InitSchema1758136067323';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product" ("id" SERIAL NOT NULL, "source_id" character varying NOT NULL, "title" character varying NOT NULL, "price" numeric NOT NULL, "currency" character varying NOT NULL, "image_url" character varying NOT NULL, "source_url" character varying NOT NULL, "last_scraped_at" TIMESTAMP, CONSTRAINT "UQ_c210304b89037da478d036e047e" UNIQUE ("source_id"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
