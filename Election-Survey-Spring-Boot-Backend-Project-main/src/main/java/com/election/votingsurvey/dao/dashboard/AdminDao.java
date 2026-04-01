package com.election.votingsurvey.dao.dashboard;

import java.util.Optional;

import com.election.votingsurvey.entity.Admin;

public interface AdminDao {
	
	/**
     * Retrieves a admin by their unique identifier.
     *
     * @param id the ID of admin
     * @return an optional containing the admin if found, otherwise empty
     */
    Optional<Admin> getAdminByIdDao(Long id);
}
