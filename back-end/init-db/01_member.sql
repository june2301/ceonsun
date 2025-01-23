USE member;

CREATE TABLE members
(
    id            BIGINT                               NOT NULL AUTO_INCREMENT PRIMARY KEY,
    kakao_id      VARCHAR(255)                         NOT NULL UNIQUE,
    name          VARCHAR(50)                          NOT NULL,
    nickname      VARCHAR(50)                          NOT NULL UNIQUE,
    gender        ENUM ('MALE', 'FEMALE')              NULL,
    email         VARCHAR(100)                         NOT NULL UNIQUE,
    profile_image VARCHAR(255)                         NULL,
    birthdate     DATE                                 NOT NULL,
    is_exposed    BOOLEAN                              NOT NULL DEFAULT TRUE,
    role          ENUM ('STUDENT', 'TEACHER', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    description   TEXT                                 NULL,
    created_at    DATETIME                             NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME                             NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    DATETIME                             NULL     DEFAULT NULL
);

CREATE TABLE teacher_info
(
    id                  BIGINT                          NOT NULL AUTO_INCREMENT PRIMARY KEY,
    member_id           BIGINT                          NOT NULL,
    teacher_description TEXT                            NULL,
    career_description  TEXT                            NULL,
    class_contents      TEXT                            NULL,
    class_progress      TEXT                            NULL,
    total_class_count   INT                             NULL,
    total_class_hours   TIME                            NULL,
    is_wanted           BOOLEAN                         NOT NULL DEFAULT TRUE,
    bank                ENUM ('KB', 'SHINHAN', 'WOORI') NOT NULL,
    account             VARCHAR(20)                     NOT NULL,
    price               INT                             NOT NULL DEFAULT 10000,
    created_at          DATETIME                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME                        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          DATETIME                        NULL     DEFAULT NULL
);

CREATE TABLE category
(
    id   BIGINT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE teacher_info_category
(
    id              BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    teacher_info_id BIGINT NOT NULL,
    category_id     BIGINT NOT NULL
);

CREATE TABLE student_info_category
(
    id          BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    member_id   BIGINT NOT NULL,
    category_id BIGINT NOT NULL
);

CREATE TABLE likes
(
    id         BIGINT   NOT NULL AUTO_INCREMENT PRIMARY KEY,
    liker      BIGINT   NOT NULL,
    likee      BIGINT   NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
