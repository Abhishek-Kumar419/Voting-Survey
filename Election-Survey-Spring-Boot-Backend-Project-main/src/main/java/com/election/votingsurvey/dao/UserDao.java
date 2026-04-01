package com.election.votingsurvey.dao;

import lombok.Data;

@Data
public class UserDao {
    private Long voterId;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String constituencyName;
}
