package com.chunsun.authservice.infrastructure.security;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SnowflakeIdGenerator {
	private static final long EPOCH = 1672531200000L;    // 기준 시간
	private static final long SEQUENCE_BITS = 12L;
	private static final long MACHINE_ID_SHIFT = SEQUENCE_BITS;
	private static final long TIMESTAMP_SHIFT = SEQUENCE_BITS + 5L;

	@Value("${snowflake.machine-id}")
	private long machineId;

	private long lastTimestamp = -1L;
	private AtomicLong sequence = new AtomicLong(0);

	public synchronized long nextId() {
		long timestamp = System.currentTimeMillis();

		if (timestamp == lastTimestamp) {
			long seq = sequence.incrementAndGet() & ((1L << SEQUENCE_BITS) - 1);
			if (seq == 0) {
				while (timestamp <= lastTimestamp) {
					timestamp = System.currentTimeMillis();
				}
			}
		} else {
			sequence.set(0);
		}

		lastTimestamp = timestamp;
		return ((timestamp - EPOCH) << TIMESTAMP_SHIFT) | (machineId << MACHINE_ID_SHIFT) | sequence.get();
	}
}
