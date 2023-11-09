import { MigrationInterface, QueryRunner } from 'typeorm'

class AddFileEntity1693721031439 implements MigrationInterface {
  name = 'AddFileEntity1693721031439'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "src" character varying,
        "filename" character varying,
        "provider" character varying NOT NULL DEFAULT 'custom',
        CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))
      `,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "file"`)
  }
}

export default AddFileEntity1693721031439
