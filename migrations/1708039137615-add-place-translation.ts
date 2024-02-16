import { MigrationInterface, QueryRunner } from 'typeorm'

class AddPlaceTranslation1708039137615 implements MigrationInterface {
  name = 'AddPlaceTranslation1708039137615'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			CREATE TABLE "place-translation" (
				"id" SERIAL NOT NULL,
				"createdAt" TIMESTAMP NOT NULL DEFAULT now(),
				"updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
				"language" character varying NOT NULL,
				"name" character varying NOT NULL,
				"country" character varying NOT NULL,
				"locality" character varying NOT NULL,
				"route" character varying NOT NULL,
				"streetNumber" character varying NOT NULL,
				"placeId" integer,
				CONSTRAINT "PK_ac2c25407406144f7ea6e2aca89" PRIMARY KEY ("id")
			)
		`)
    await queryRunner.query(`
			ALTER TABLE "place-translation"
			ADD CONSTRAINT "FK_67d3505d91b84267074ef5cb848"
				FOREIGN KEY ("placeId")
				REFERENCES "place"("id")
				ON DELETE NO ACTION
				ON UPDATE NO ACTION
		`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			ALTER TABLE "place-translation"
			DROP CONSTRAINT "FK_67d3505d91b84267074ef5cb848"
		`)
    await queryRunner.query(`DROP TABLE "place-translation"`)
  }
}

export default AddPlaceTranslation1708039137615
