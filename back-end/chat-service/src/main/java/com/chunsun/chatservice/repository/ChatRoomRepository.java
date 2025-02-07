package com.chunsun.chatservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chunsun.chatservice.domain.ChatRoom;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
	Optional<ChatRoom> findByStudentIdAndTeacherId(Long studentId, Long teacherId);
}
