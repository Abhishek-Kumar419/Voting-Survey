package com.election.votingsurvey.dao.dashboard;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.election.votingsurvey.entity.Admin;
import com.election.votingsurvey.repository.AdminRepository;

@Repository
public class AdminImpDao implements AdminDao {
	
	@Autowired
	private AdminRepository repository;

	@Override
	public Optional<Admin> getAdminByIdDao(Long id) {
		return repository.findById(id);
	}
}


