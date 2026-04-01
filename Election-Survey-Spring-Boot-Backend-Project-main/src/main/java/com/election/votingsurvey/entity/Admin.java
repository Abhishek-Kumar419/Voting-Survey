package com.election.votingsurvey.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin")
public class Admin {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "voter_id")
    private Long voterId;

    @Column(name = "password", nullable = false)
    private String password;

    public Long getId() { return id; }
    public Long getVoterId() { return voterId; }
    public String getPassword() { return password; }
}
