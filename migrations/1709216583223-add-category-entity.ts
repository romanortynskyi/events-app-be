import { MigrationInterface, QueryRunner } from 'typeorm'

class AddCategoryEntity1709216583223 implements MigrationInterface {
  name = 'AddCategoryEntity1709216583223'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			CREATE TABLE "category" (
				"id" SERIAL NOT NULL,
				"createdAt" TIMESTAMP NOT NULL DEFAULT now(),
				"updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
				"eventsCount" integer NOT NULL DEFAULT '0',
				CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")
			)
		`)
    await queryRunner.query(`
			CREATE TABLE "event-category" (
				"eventId" integer NOT NULL,
				"categoryId" integer NOT NULL,
				CONSTRAINT "PK_be85f4d4f79d2e4f53685ed7f96" PRIMARY KEY ("eventId", "categoryId")
			)
		`)
    await queryRunner.query(`
			CREATE INDEX "IDX_9fc5e5dab789917cc33940c08a"
			ON "event-category" ("eventId")
		`)
    await queryRunner.query(`
			CREATE INDEX "IDX_0c38526fad528c70c7c5baaa08"
			ON "event-category" ("categoryId")
		`)
    await queryRunner.query(`
			ALTER TABLE "event-category"
			ADD CONSTRAINT "FK_9fc5e5dab789917cc33940c08a9"
			FOREIGN KEY ("eventId")
			REFERENCES "event"("id")
			ON DELETE CASCADE
			ON UPDATE CASCADE
		`)
    await queryRunner.query(`
			ALTER TABLE "event-category"
			ADD CONSTRAINT "FK_0c38526fad528c70c7c5baaa081"
			FOREIGN KEY ("categoryId")
			REFERENCES "category"("id")
			ON DELETE NO ACTION
			ON UPDATE NO ACTION
		`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			ALTER TABLE "event-category"
			DROP CONSTRAINT "FK_0c38526fad528c70c7c5baaa081"
		`)
    await queryRunner.query(`
			ALTER TABLE "event-category"
			DROP CONSTRAINT "FK_9fc5e5dab789917cc33940c08a9"
		`)
    await queryRunner.query(`
			DROP INDEX "public"."IDX_0c38526fad528c70c7c5baaa08"
		`)
    await queryRunner.query(`
			DROP INDEX "public"."IDX_9fc5e5dab789917cc33940c08a"
		`)
    await queryRunner.query(`DROP TABLE "event-category"`)
    await queryRunner.query(`DROP TABLE "category"`)
  }
}

export default AddCategoryEntity1709216583223
