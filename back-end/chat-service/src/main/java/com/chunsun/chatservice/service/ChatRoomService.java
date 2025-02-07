package com.chunsun.chatservice.service;

import com.chunsun.chatservice.web.dto.NewChatRoomDto;

public interface ChatRoomService {
	void requestClass(NewChatRoomDto.RequestDto requestDto);
}
