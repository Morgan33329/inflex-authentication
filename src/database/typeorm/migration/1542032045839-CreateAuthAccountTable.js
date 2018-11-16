export class CreateAuthAccountTable1542032045839 {

    async up(queryRunner) {
        await queryRunner.query(' \
            CREATE TABLE `auth_account`  ( \
            `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, \
            `identity_id` int(11) UNSIGNED NOT NULL, \
            `account` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, \
            `type` smallint(6) NOT NULL, \
            `created_at` timestamp(0) NULL DEFAULT NULL, \
            PRIMARY KEY (`id`) USING BTREE, \
            INDEX `identityId`(`identity_id`) USING BTREE, \
            CONSTRAINT `AccountidentityRelation` FOREIGN KEY (`identity_id`) REFERENCES `auth_identity` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT \
            ) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci; \
        ');
    }

    async down(queryRunner) { 
        await queryRunner.query('DROP TABLE IF EXISTS `auth_account`;');
    }
}
