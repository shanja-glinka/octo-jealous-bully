import { MigrationInterface, QueryRunner } from 'typeorm';

export class DbMigration1724937740680 implements MigrationInterface {
  name = 'DbMigration1724937740680';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "short_text" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" uuid, "updatedBy" uuid, "deletedBy" uuid, "signature" text NOT NULL, "text" text NOT NULL, "resultFileResources" text array, CONSTRAINT "UQ_91dec5b432dd67bd2115543a5da" UNIQUE ("signature"), CONSTRAINT "PK_251a5ee7a0b4750aff9c93b3b56" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "short_text"`);
  }
}
