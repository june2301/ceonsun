USE
class;

CREATE TABLE class_requests
(
    id         BIGINT   NOT NULL AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT   NOT NULL,
    student_id BIGINT   NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lesson_records
(
    id                  BIGINT   NOT NULL AUTO_INCREMENT PRIMARY KEY,
    contracted_class_id BIGINT   NOT NULL,
    start_time          DATETIME NOT NULL,
    end_time            DATETIME NOT NULL,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          DATETIME NULL DEFAULT NULL
);

CREATE TABLE contracted_class
(
    id           BIGINT   NOT NULL AUTO_INCREMENT PRIMARY KEY,
    teacher_id   BIGINT   NOT NULL,
    student_id   BIGINT   NOT NULL,
    status       ENUM('PROGRESS', 'END') NOT NULL DEFAULT 'PROGRESS',
    remain_class INT      NOT NULL DEFAULT 0,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at   DATETIME NULL DEFAULT NULL
);


