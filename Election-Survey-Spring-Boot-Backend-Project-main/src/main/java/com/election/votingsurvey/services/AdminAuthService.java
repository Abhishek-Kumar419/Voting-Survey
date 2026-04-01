package com.election.votingsurvey.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.election.votingsurvey.dao.dashboard.AdminDao;
import com.election.votingsurvey.entity.Admin;

@Service
public class AdminAuthService implements AdminService {

	@Autowired
	private AdminDao dao;

	@Override
	public Optional<Admin> getAdminById(Long id) {
		return dao.getAdminByIdDao(id);
	}

	@Override
	public boolean authAdminByIdAndPassword(Long id, String password) {
		Optional<Admin> optional = getAdminById(id);
		if (!optional.isPresent()) return false;
		Admin admin = optional.get();
		System.out.println("DB id=" + admin.getId() + " DB pass=" + admin.getPassword());
		System.out.println("Input id=" + id + " Input pass=" + password);
		return admin.getPassword() != null && admin.getPassword().equals(password);
	}
	
	
}

