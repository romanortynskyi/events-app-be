import { MigrationInterface, QueryRunner } from 'typeorm'

class AddEventEntity1694960352936 implements MigrationInterface {
  name = 'AddEventEntity1694960352936'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "event" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "placeId" integer,
        "title" character varying,
        "description" character varying,
        "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
        "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
        "ticketPrice" numeric NOT NULL,
        "authorId" integer,
        "imageId" integer,
        CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")
    )`)
    await queryRunner.query(`
      ALTER TABLE "event"
      ADD CONSTRAINT "FK_c180b5b1724f7dd9f6d50915c79"
      FOREIGN KEY ("authorId")
      REFERENCES "user"("id") 
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
    `)
    await queryRunner.query(`
      ALTER TABLE "event"
      ADD CONSTRAINT "FK_66f2fc2fdf2751fd00dbb7bc5a6"
      FOREIGN KEY ("imageId")
      REFERENCES "file"("id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "event"
      DROP CONSTRAINT "FK_66f2fc2fdf2751fd00dbb7bc5a6"
    `)
    await queryRunner.query(`
      ALTER TABLE "event"
      DROP CONSTRAINT "FK_c180b5b1724f7dd9f6d50915c79"
    `)
    await queryRunner.query(`DROP TABLE "event"`)
  }
}

export default AddEventEntity1694960352936
