export class CreateAuthHashTable1542032045841 {

    async up(queryRunner) {
        await queryRunner.query(' \
            CREATE TABLE `auth_hash`  ( \
            `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, \
            `identity_id` int(11) UNSIGNED NOT NULL, \
            `account_id` int(11) UNSIGNED NULL DEFAULT NULL, \
            `hash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, \
            `type` smallint(6) NOT NULL, \
            `created_at` timestamp(0) NULL DEFAULT NULL, \
            PRIMARY KEY (`id`) USING BTREE, \
            INDEX `identityId`(`identity_id`) USING BTREE, \
            INDEX `accountId`(`account_id`) USING BTREE, \
            CONSTRAINT `hashAccountRelation` FOREIGN KEY (`account_id`) REFERENCES `auth_account` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT, \
            CONSTRAINT `hashIdentityRelation` FOREIGN KEY (`identity_id`) REFERENCES `auth_identity` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT \
            ) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci; \
        ');
    }

    async down(queryRunner) { 
        await queryRunner.query('DROP TABLE IF EXISTS `auth_hash`;');
    }
}
