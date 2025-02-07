package com.chunsun.chatservice.service;

import com.chunsun.chatservice.web.dto.MessageDto;

public interface MessageService {
	void sendMessage(MessageDto messageDto);
}
