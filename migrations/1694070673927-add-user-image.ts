import { MigrationInterface, QueryRunner } from 'typeorm'

class AddUserImage1694070673927 implements MigrationInterface {
  name = 'AddUserImage1694070673927'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "imageId" integer`)
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD CONSTRAINT "FK_5e028298e103e1694147ada69e5"
      FOREIGN KEY ("imageId")
      REFERENCES "file"("id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      DROP CONSTRAINT "FK_5e028298e103e1694147ada69e5"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "imageId" integer`)
  }
}

export default AddUserImage1694070673927
