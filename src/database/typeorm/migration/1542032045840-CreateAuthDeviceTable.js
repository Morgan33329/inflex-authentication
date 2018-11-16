export class CreateAuthDeviceTable1542032045840 {
    async up(queryRunner) {
        await queryRunner.query(' \
            CREATE TABLE `auth_device`  ( \
            `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, \
            `identity_id` int(11) UNSIGNED NOT NULL, \
            `refresh_token` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, \
            `device_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, \
            `device_type` smallint(6) NULL DEFAULT NULL, \
            `device_push` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, \
            `device_language` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, \
            `is_guest` smallint(6) NOT NULL DEFAULT 0, \
            `disabled` smallint(6) NOT NULL DEFAULT 0, \
            `created_at` timestamp(0) NULL DEFAULT NULL, \
            PRIMARY KEY (`id`) USING BTREE, \
            INDEX `identityId`(`identity_id`) USING BTREE, \
            CONSTRAINT `deviceIdentityRelation` FOREIGN KEY (`identity_id`) REFERENCES `auth_identity` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT \
            ) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci; \
        ');
    }

    async down(queryRunner) { 
        await queryRunner.query('DROP TABLE IF EXISTS `auth_device`;');
    }
}
