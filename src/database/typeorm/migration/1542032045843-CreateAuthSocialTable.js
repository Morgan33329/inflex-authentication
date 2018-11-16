export class CreateAuthSocialTable1542032045843 {

    async up(queryRunner) {
        await queryRunner.query(' \
            CREATE TABLE `auth_social`  ( \
            `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, \
            `identity_id` int(11) UNSIGNED NOT NULL, \
            `social_type` smallint(6) NOT NULL, \
            `social_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, \
            `created_at` timestamp(0) NULL DEFAULT NULL, \
            PRIMARY KEY (`id`) USING BTREE, \
            INDEX `identityId`(`identity_id`) USING BTREE, \
            CONSTRAINT `socialIdentityRelation` FOREIGN KEY (`identity_id`) REFERENCES `auth_identity` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT \
            ) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci; \
        ');
    }

    async down(queryRunner) { 
        await queryRunner.query('DROP TABLE IF EXISTS `auth_social`;');
    }
}
