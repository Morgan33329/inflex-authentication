export class CreateAuthIdentity1542032045838 {

    async up(queryRunner) {
        await queryRunner.query(' \
            CREATE TABLE `auth_identity`  ( \
            `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, \
            `activated` smallint(6) NOT NULL DEFAULT 1, \
            `enabled` smallint(6) NOT NULL DEFAULT 1, \
            `blocked` smallint(6) NOT NULL DEFAULT 1, \
            `blocked_at` timestamp(0) NULL DEFAULT NULL, \
            `created_at` timestamp(0) NULL DEFAULT NULL, \
            `updated_at` timestamp(0) NULL DEFAULT NULL, \
            `deleted_at` timestamp(0) NULL DEFAULT NULL, \
            PRIMARY KEY (`id`) USING BTREE \
            ) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci; \
        ');
    }

    async down(queryRunner) { 
        await queryRunner.query('DROP TABLE IF EXISTS `auth_identity`;');
    }
}
