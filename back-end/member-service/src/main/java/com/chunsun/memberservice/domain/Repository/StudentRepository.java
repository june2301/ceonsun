package com.chunsun.memberservice.domain.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chunsun.memberservice.domain.Entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

}
