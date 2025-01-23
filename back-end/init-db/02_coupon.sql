USE
coupon;

CREATE TABLE member_coupon
(
    id          BIGINT   NOT NULL AUTO_INCREMENT PRIMARY KEY,
    coupon_id   BIGINT   NOT NULL,
    member_id   BIGINT   NOT NULL,
    status      ENUM('UNUSED', 'USED', 'EXPIRED') NOT NULL DEFAULT 'UNUSED',
    expiry_date DATETIME NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  DATETIME NULL
);

CREATE TABLE coupons
(
    id                 BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name               VARCHAR(255) NOT NULL,
    discount_rate      INT          NOT NULL,
    valid_days         INT          NOT NULL,
    total_quantity     INT          NOT NULL,
    remaining_quantity INT          NOT NULL,
    expiry_date        DATETIME     NOT NULL,
    created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at         DATETIME NULL
);