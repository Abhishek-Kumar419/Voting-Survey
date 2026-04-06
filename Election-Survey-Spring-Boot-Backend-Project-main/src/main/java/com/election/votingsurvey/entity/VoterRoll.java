package com.election.votingsurvey.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "voter_roll", indexes = {
    @Index(name = "idx_voter_id", columnList = "voterId", unique = true),
    @Index(name = "idx_constituency", columnList = "constituencyName")
})
public class VoterRoll {

    @Id
    private Long voterId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String constituencyName;

    @Column(nullable = false)
    private String dob;

    private String gender;

    private String address;

    private Boolean isEligible = true;

    private Boolean isRegistered = false;

    @Column(updatable = false)
    private LocalDateTime loadedAt;

    @PrePersist
    protected void onCreate() {
        loadedAt = LocalDateTime.now();
    }
}
