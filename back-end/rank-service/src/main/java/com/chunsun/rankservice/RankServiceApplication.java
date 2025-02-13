package com.chunsun.rankservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class RankServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(RankServiceApplication.class, args);
    }

}
