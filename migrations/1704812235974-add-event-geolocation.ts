import { MigrationInterface, QueryRunner } from 'typeorm'

class AddEventGeolocation1704812235974 implements MigrationInterface {
  name = 'AddEventGeolocation1704812235974'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			ALTER TABLE "event"
			ADD "geolocation"
			geography(Point,4326)
		`)
    await queryRunner.query(`
			CREATE INDEX "IDX_a321758459b60a2b8340ee131e"
			ON "event"
			USING GiST ("geolocation")
		`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_a321758459b60a2b8340ee131e"`)
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "geolocation"`)
  }
}

export default AddEventGeolocation1704812235974
