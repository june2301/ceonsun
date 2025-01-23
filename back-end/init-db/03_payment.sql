USE
payment;

-- payment_method ENUM값 추가해야함
CREATE TABLE orders
(
    id                  BIGINT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    member_id           BIGINT      NOT NULL,
    coupon_id           BIGINT      NOT NULL,
    contracted_class_id BIGINT      NOT NULL,
    amount              INT         NOT NULL,
    payment_status      ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
    payment_method      ENUM('CREDIT_CARD', 'KAKAO', 'NAVER') NOT NULL,
    payment_number      VARCHAR(50) NOT NULL,
    created_at          DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          DATETIME NULL
);
