export class CreateAuthPasswordTable1542032045842 {

    async up(queryRunner) {
        await queryRunner.query(' \
            CREATE TABLE `auth_password`  ( \
            `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, \
            `identity_id` int(11) UNSIGNED NOT NULL, \
            `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, \
            `expired_at` timestamp(0) NULL DEFAULT NULL, \
            `created_at` timestamp(0) NULL DEFAULT NULL, \
            PRIMARY KEY (`id`) USING BTREE, \
            INDEX `identityId`(`identity_id`) USING BTREE, \
            CONSTRAINT `passwordIdentityRelation` FOREIGN KEY (`identity_id`) REFERENCES `auth_identity` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT \
            ) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci; \
        ');
    }

    async down(queryRunner) { 
        await queryRunner.query('DROP TABLE IF EXISTS `auth_password`;');
    }
}
