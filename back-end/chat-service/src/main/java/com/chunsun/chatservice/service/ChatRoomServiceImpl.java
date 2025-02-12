package com.chunsun.chatservice.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.chunsun.chatservice.converter.ChatRoomConverter;
import com.chunsun.chatservice.web.dto.MessageDto;
import com.chunsun.chatservice.web.dto.NewChatRoomDto;
import com.chunsun.chatservice.domain.ChatRoom;
import com.chunsun.chatservice.repository.ChatRoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatRoomServiceImpl implements ChatRoomService {

	private final MessageService messageService;
	private final ChatRoomRepository chatRoomRepository;

	@Override
	public void requestClass(NewChatRoomDto.RequestDto requestDto) {
		// 1. 회원 검증
		// TODO: 존재하는 회원인지 확인

		//  2-1. 채팅방이 존재하지 않으면 채팅방 생성
		ChatRoom chatRoom;
		Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findByStudentIdAndTeacherId(requestDto.studentId(),
			requestDto.teacherId());
		if (chatRoomOptional.isEmpty()) {
			log.info("채팅방이 존재하지 않아 채팅방을 생성합니다.");
			log.info("studentId: {}, teacherId: {}", requestDto.studentId(),
				requestDto.teacherId());
			// 채팅방 생성
			chatRoom = chatRoomRepository.save(ChatRoomConverter.ToEntity(requestDto));
		} else {
			chatRoom = chatRoomOptional.get();
		}

		// 2-2. 초기 문의 메시지 전송
		MessageDto initMessage = MessageDto.builder()
			.roomId(chatRoom.getId().toString())
			.senderId(requestDto.studentId().toString())
			.message("(초기메시지) 안녕하세요! 과외 문의 드려요~")
			.sentAt(LocalDateTime.now().toString())
			.build();
		
		// 메시지 전송
		messageService.sendMessage(initMessage);
	}
}
