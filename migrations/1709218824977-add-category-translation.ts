import { MigrationInterface, QueryRunner } from 'typeorm'

class AddCategoryTranslation1709218824977 implements MigrationInterface {
  name = 'AddCategoryTranslation1709218824977'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			CREATE TABLE "category-translation" (
				"id" SERIAL NOT NULL,
				"createdAt" TIMESTAMP NOT NULL DEFAULT now(),
				"updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
				"language" character varying NOT NULL,
				"name" character varying NOT NULL,
				"categoryId" integer,
				CONSTRAINT "PK_4b6e9108815b6faad43c493f437" PRIMARY KEY ("id"))
		`)
    await queryRunner.query(`
			ALTER TABLE "category-translation"
			ADD CONSTRAINT "FK_816849ea7035068fb0ad9885593"
			FOREIGN KEY ("categoryId")
			REFERENCES "category"("id")
			ON DELETE CASCADE
			ON UPDATE CASCADE
		`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
   	await queryRunner.query(`
			ALTER TABLE "category-translation"
			DROP CONSTRAINT "FK_816849ea7035068fb0ad9885593"
		`)
    await queryRunner.query(`DROP TABLE "category-translation"`)
  }
}

export default AddCategoryTranslation1709218824977
