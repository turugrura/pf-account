import {MigrationInterface, QueryRunner} from "typeorm";

export class init1631437748298 implements MigrationInterface {
    name = 'init1631437748298'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`pfaccount\`.\`account\` (\`id\` char(36) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(255) NOT NULL DEFAULT 'system', \`updatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(255) NOT NULL DEFAULT 'system', \`deletedDate\` datetime(6) NULL, \`deletedBy\` varchar(255) NULL, \`version\` int NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_41dfcb70af895ddf9a53094515\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pfaccount\`.\`refresh_token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`refreshToken\` varchar(255) NOT NULL, \`expiryDate\` datetime NOT NULL, \`createdDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`version\` int NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`accountId\` char(36) NULL, INDEX \`IDX_428e14ded7299edfcf58918bea\` (\`refreshToken\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`pfaccount\`.\`refresh_token\` ADD CONSTRAINT \`FK_a693f961290344083b358599874\` FOREIGN KEY (\`accountId\`) REFERENCES \`pfaccount\`.\`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pfaccount\`.\`refresh_token\` DROP FOREIGN KEY \`FK_a693f961290344083b358599874\``);
        await queryRunner.query(`DROP INDEX \`IDX_428e14ded7299edfcf58918bea\` ON \`pfaccount\`.\`refresh_token\``);
        await queryRunner.query(`DROP TABLE \`pfaccount\`.\`refresh_token\``);
        await queryRunner.query(`DROP INDEX \`IDX_41dfcb70af895ddf9a53094515\` ON \`pfaccount\`.\`account\``);
        await queryRunner.query(`DROP TABLE \`pfaccount\`.\`account\``);
    }

}
