import { MigrationInterface, QueryRunner } from 'typeorm'

class AddPlaceEntity1708032193434 implements MigrationInterface {
  name = 'AddPlaceEntity1708028281000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			CREATE TABLE "place" (
				"id" SERIAL NOT NULL,
				"createdAt" TIMESTAMP NOT NULL DEFAULT now(),
				"updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
				"originalId" character varying NOT NULL,
				CONSTRAINT "UQ_9591cd0019ce2bc467a61b4217a" UNIQUE ("originalId"),
				CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca" PRIMARY KEY ("id")
			)
		`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			ALTER TABLE "place"
			DROP CONSTRAINT "UQ_9591cd0019ce2bc467a61b4217a"
		`)
		await queryRunner.query(`
			ALTER TABLE "place"
			DROP CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca"
		`)
    await queryRunner.query(`DROP TABLE "place"`)
  }
}

export default AddPlaceEntity1708032193434
