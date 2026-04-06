package com.election.votingsurvey.dao;

import lombok.Data;

@Data
public class UserDao {
    private Long voterId;
    private String dob;
    private String email;
    private String password;
    private String phone;
}
