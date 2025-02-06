package com.chunsun.memberservice.domain.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chunsun.memberservice.domain.Entity.Teacher;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}
