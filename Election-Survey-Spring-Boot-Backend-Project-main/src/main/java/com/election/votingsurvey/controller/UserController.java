package com.election.votingsurvey.controller;

import com.election.votingsurvey.dao.UserDao;
import com.election.votingsurvey.entity.User;
import com.election.votingsurvey.services.UserService;
import com.election.votingsurvey.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDao userDao) {
        try {
            User user = userService.registerUser(userDao);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        try {
            String voterIdStr = credentials.get("voterId");
            if (voterIdStr == null || voterIdStr.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Voter ID format");
            }
            Long voterId = Long.parseLong(voterIdStr);
            String password = credentials.get("password");
            Map<String, Object> result = userService.loginUser(voterId, password);
            return ResponseEntity.ok(result);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Voter ID format");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/voter/{voterId}")
    public ResponseEntity<?> getUserByVoterId(@PathVariable Long voterId) {
        return userService.getUserByVoterId(voterId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDao userDao) {
        try {
            User user = userService.updateUser(id, userDao);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/vote/{voterId}")
    public ResponseEntity<?> markAsVoted(
            @PathVariable Long voterId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);

            Long tokenVoterId = jwtUtil.extractVoterId(token);
            if (!tokenVoterId.equals(voterId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only cast your own vote");
            }

            String tokenConstituency = jwtUtil.extractConstituency(token);
            User user = userService.markAsVoted(voterId, tokenConstituency);
            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg != null && msg.contains("already voted")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(msg);
            }
            if (msg != null && msg.contains("Unauthorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(msg);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
        }
    }
}
