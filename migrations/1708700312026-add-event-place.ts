import { MigrationInterface, QueryRunner } from 'typeorm'

class AddEventPlace1708700312026 implements MigrationInterface {
  name = 'AddEventPlace1708700312026'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
	    ALTER TABLE "event"
      ADD CONSTRAINT "FK_48f8fdd484d8e24b6ec3c91f0f5"
        FOREIGN KEY ("placeId")
        REFERENCES "place"("id")
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
      `)
    }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			ALTER TABLE "event"
			DROP CONSTRAINT "FK_48f8fdd484d8e24b6ec3c91f0f5"
		`)
  }
}

export default AddEventPlace1708700312026
