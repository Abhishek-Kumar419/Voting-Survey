package com.election.votingsurvey.services;

import com.election.votingsurvey.dao.UserDao;
import com.election.votingsurvey.entity.User;
import com.election.votingsurvey.entity.VoterRoll;
import com.election.votingsurvey.repository.UserRepository;
import com.election.votingsurvey.repository.VoterRollRepository;
import com.election.votingsurvey.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VoterRollRepository voterRollRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(UserDao userDao) {

        VoterRoll roll = voterRollRepository.findById(userDao.getVoterId())
            .orElseThrow(() -> new RuntimeException("Voter ID not found in electoral roll"));

        if (!roll.getIsEligible()) {
            throw new RuntimeException("This Voter ID is not eligible to vote");
        }

        if (roll.getIsRegistered()) {
            throw new RuntimeException("An account already exists for this Voter ID");
        }

        if (!roll.getDob().equals(userDao.getDob())) {
            throw new RuntimeException("Date of birth does not match electoral records");
        }

        if (userRepository.existsByEmail(userDao.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setVoterId(roll.getVoterId());
        user.setName(roll.getName());
        user.setConstituencyName(roll.getConstituencyName());
        user.setEmail(userDao.getEmail());
        user.setPassword(passwordEncoder.encode(userDao.getPassword()));
        user.setPhone(userDao.getPhone());
        user.setAddress(roll.getAddress());

        roll.setIsRegistered(true);
        voterRollRepository.save(roll);

        return userRepository.save(user);
    }

    public Map<String, Object> loginUser(Long voterId, String password) {
        User user = userRepository.findByVoterId(voterId)
            .orElseThrow(() -> new RuntimeException("Invalid Voter ID or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid Voter ID or password");
        }

        String token = jwtUtil.generateToken(user.getVoterId(), user.getConstituencyName());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("token", token);
        response.put("voterId", user.getVoterId());
        response.put("name", user.getName());
        response.put("constituencyName", user.getConstituencyName());
        response.put("hasVoted", user.getHasVoted());
        return response;
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
        user.setEmail(userDao.getEmail());
        user.setPhone(userDao.getPhone());
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User markAsVoted(Long voterId, String tokenConstituency) {
        User user = userRepository.findByVoterId(voterId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getConstituencyName().equalsIgnoreCase(tokenConstituency)) {
            throw new RuntimeException("Unauthorized: You can only vote in your registered constituency");
        }

        if (Boolean.TRUE.equals(user.getHasVoted())) {
            throw new RuntimeException("User has already voted");
        }

        user.setHasVoted(true);
        return userRepository.save(user);
    }
}
