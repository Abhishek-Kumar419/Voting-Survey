package com.election.votingsurvey.services;

import com.election.votingsurvey.dao.UserDao;
import com.election.votingsurvey.entity.User;
import com.election.votingsurvey.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User registerUser(UserDao userDao) {
        if (userRepository.existsByVoterId(userDao.getVoterId())) {
            throw new RuntimeException("Voter ID already exists");
        }
        if (userRepository.existsByEmail(userDao.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setVoterId(userDao.getVoterId());
        user.setName(userDao.getName());
        user.setEmail(userDao.getEmail());
        user.setPassword(userDao.getPassword());
        user.setPhone(userDao.getPhone());
        user.setAddress(userDao.getAddress());
        user.setConstituencyName(userDao.getConstituencyName());
        
        return userRepository.save(user);
    }
    
    public Optional<User> loginUser(Long voterId, String password) {
        Optional<User> user = userRepository.findByVoterId(voterId);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }
        return Optional.empty();
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByVoterId(Long voterId) {
        return userRepository.findByVoterId(voterId);
    }
    
    public User updateUser(Long id, UserDao userDao) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setName(userDao.getName());
        user.setEmail(userDao.getEmail());
        user.setPhone(userDao.getPhone());
        user.setAddress(userDao.getAddress());
        user.setConstituencyName(userDao.getConstituencyName());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    public User markAsVoted(Long voterId) {
        User user = userRepository.findByVoterId(voterId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setHasVoted(true);
        return userRepository.save(user);
    }
}
