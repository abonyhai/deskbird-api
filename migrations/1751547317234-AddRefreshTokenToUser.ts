import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUser1751547317234 implements MigrationInterface {
    name = 'AddRefreshTokenToUser1751547317234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
    }

}
