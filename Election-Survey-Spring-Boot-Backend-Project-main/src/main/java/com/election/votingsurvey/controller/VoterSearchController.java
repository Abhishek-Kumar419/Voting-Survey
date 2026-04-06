package com.election.votingsurvey.controller;

import com.election.votingsurvey.entity.VoterRoll;
import com.election.votingsurvey.repository.VoterRollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/voter-search")
@CrossOrigin(origins = "*")
public class VoterSearchController {

    @Autowired
    private VoterRollRepository voterRollRepository;

    // STEP 1 — Search by name + dob, returns masked voter ID
    @GetMapping("/find")
    public ResponseEntity<?> findVoter(
            @RequestParam String name,
            @RequestParam String dob) {

        if (name == null || name.trim().length() < 3) {
            return ResponseEntity.badRequest()
                .body("Enter at least 3 characters of your name");
        }
        if (dob == null || !dob.matches("\\d{4}-\\d{2}-\\d{2}")) {
            return ResponseEntity.badRequest()
                .body("Date format must be YYYY-MM-DD");
        }

        List<VoterRoll> results = voterRollRepository
            .findByNameContainingIgnoreCaseAndDob(name.trim(), dob.trim());

        if (results.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No voter found. Please check your name and date of birth.");
        }

        List<Map<String, Object>> response = results.stream().map(voter -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("maskedVoterId", maskVoterId(voter.getVoterId()));
            map.put("name", voter.getName());
            map.put("gender", voter.getGender());
            map.put("constituencyName", voter.getConstituencyName());
            map.put("address", voter.getAddress());
            map.put("isRegistered", voter.getIsRegistered());
            return map;
        }).toList();

        return ResponseEntity.ok(response);
    }

    // STEP 2 — Confirm full voter ID + dob, reveals complete details
    @GetMapping("/confirm")
    public ResponseEntity<?> confirmVoter(
            @RequestParam Long voterId,
            @RequestParam String dob) {

        Optional<VoterRoll> result = voterRollRepository
            .findByVoterIdAndDob(voterId, dob);

        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Voter ID and date of birth do not match");
        }

        VoterRoll voter = result.get();

        if (!voter.getIsEligible()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("This voter ID is not eligible");
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("voterId", voter.getVoterId());
        response.put("name", voter.getName());
        response.put("gender", voter.getGender());
        response.put("constituencyName", voter.getConstituencyName());
        response.put("address", voter.getAddress());
        response.put("isEligible", voter.getIsEligible());
        response.put("isRegistered", voter.getIsRegistered());

        return ResponseEntity.ok(response);
    }

    // DEMO ONLY — Remove before real deployment
    @GetMapping("/demo-voters")
    public ResponseEntity<?> getDemoVoters(
            @RequestParam(defaultValue = "10") int count) {

        List<VoterRoll> sample = voterRollRepository
            .findAll(PageRequest.of(0, Math.min(count, 20)))
            .getContent();

        List<Map<String, Object>> result = sample.stream().map(v -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("voterId", v.getVoterId());
            map.put("name", v.getName());
            map.put("dob", v.getDob());
            map.put("constituencyName", v.getConstituencyName());
            map.put("isRegistered", v.getIsRegistered());
            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }

    private String maskVoterId(Long voterId) {
        String id = String.valueOf(voterId);
        if (id.length() <= 4) return id;
        return id.substring(0, 2)
             + "*".repeat(id.length() - 4)
             + id.substring(id.length() - 2);
    }
}
