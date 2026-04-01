package com.election.votingsurvey.services;

import java.util.Optional;

import com.election.votingsurvey.entity.Admin;

public interface AdminService {
	
	/**
     * Fetches a admin by their unique ID.
     *
     * @param id The ID of the admin.
     * @return An Optional containing the admin if found, otherwise empty.
     */
	Optional<Admin> getAdminById(Long id);
	
	// Authorization User
	public boolean authAdminByIdAndPassword(Long id, String password);
}
