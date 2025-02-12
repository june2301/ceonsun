USE `rank`;

CREATE TABLE teacher_scores (
    teacher_id BIGINT PRIMARY KEY,
    lessons INT NOT NULL DEFAULT 0,
    views INT NOT NULL DEFAULT 0,
    total_score BIGINT NOT NULL DEFAULT 0,  -- 누적 점수
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- 마지막 업데이트 시간
);