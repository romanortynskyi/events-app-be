import { MigrationInterface, QueryRunner } from 'typeorm'

class AddPlaceLocation1708028281541 implements MigrationInterface {
  name = 'AddPlaceLocation1708028281541'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			ALTER TABLE "place"
			ADD "location"
			geography(Point,4326)
		`)
		await queryRunner.query(`
			CREATE INDEX "IDX_a321758459b60a2b8340ee242f"
			ON "place"
			USING GiST ("location")
		`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "public"."IDX_a321758459b60a2b8340ee242f"`)
		await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "location"`)
	}
}

export default AddPlaceLocation1708028281541
