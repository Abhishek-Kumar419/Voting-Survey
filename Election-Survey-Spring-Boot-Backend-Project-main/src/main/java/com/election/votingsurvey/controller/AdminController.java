package com.election.votingsurvey.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.election.votingsurvey.entity.Admin;
import com.election.votingsurvey.services.AdminService;

@RestController
@RequestMapping(value = "/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService service; // Add @Autowired

    @GetMapping("/{id}") 
    public Optional<Admin> getUserByIdController(@PathVariable(name = "id") Long id) {
        return service.getAdminById(id);
    }
    
    @PostMapping(value = "/auth")
    public ResponseEntity<Boolean> authAdminByIdAndPassword(@RequestBody Map<String, String> logingRequest) {
        try {
            Long id = Long.valueOf(logingRequest.get("id"));
            String password = logingRequest.get("password");
            boolean result = service.authAdminByIdAndPassword(id, password);
            return result ? ResponseEntity.ok(true) : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        } catch (NumberFormatException | NullPointerException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
        }
    }
}



