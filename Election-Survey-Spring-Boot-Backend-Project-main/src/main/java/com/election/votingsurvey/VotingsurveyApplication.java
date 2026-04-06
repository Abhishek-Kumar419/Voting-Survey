package com.election.votingsurvey;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class VotingsurveyApplication {
	public static void main(String[] args) {
		SpringApplication.run(VotingsurveyApplication.class, args);
		System.out.println("BUILD SUCCESSFUL.");
	}
}
