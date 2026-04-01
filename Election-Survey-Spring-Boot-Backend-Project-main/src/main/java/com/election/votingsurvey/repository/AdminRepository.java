package com.election.votingsurvey.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.election.votingsurvey.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {

}
