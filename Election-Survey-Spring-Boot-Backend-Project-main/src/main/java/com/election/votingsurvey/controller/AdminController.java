package com.election.votingsurvey.controller;

import com.election.votingsurvey.entity.Constituency;
import com.election.votingsurvey.entity.Party;
import com.election.votingsurvey.repository.ConstituencyRepository;
import com.election.votingsurvey.repository.PartyRepository;
import com.election.votingsurvey.repository.VoterRollRepository;
import com.election.votingsurvey.services.AdminService;
import com.election.votingsurvey.services.VoterDataGenerator;
import com.election.votingsurvey.services.VoterRollImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private VoterRollImportService importService;

    @Autowired
    private VoterDataGenerator voterDataGenerator;

    @Autowired
    private AdminService adminService;

    @Autowired
    private ConstituencyRepository constituencyRepository;

    @Autowired
    private PartyRepository partyRepository;

    @Autowired
    private VoterRollRepository voterRollRepository;

    @Value("${admin.secret}")
    private String adminSecret;

    @PostMapping("/auth")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> body) {
        try {
            Long id = Long.parseLong(body.get("id"));
            String password = body.get("password");
            boolean valid = adminService.authAdminByIdAndPassword(id, password);
            if (!valid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid ID or Password");
            }
            return ResponseEntity.ok(Map.of("message", "Login successful", "id", id));
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Admin ID format");
        }
    }

    @PostMapping("/import-voters")
    public ResponseEntity<?> importVoters(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("X-Admin-Secret") String secret) {

        if (!adminSecret.equals(secret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");
        }
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        try {
            VoterRollImportService.ImportResult result = importService.importFromCsv(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Import failed: " + e.getMessage());
        }
    }

    @GetMapping("/seed-voters")
    public ResponseEntity<?> seedVoters(@RequestParam(defaultValue = "200") int count) {
        long existing = voterRollRepository.count();
        if (existing > 0) {
            return ResponseEntity.ok("Voter roll already has " + existing + " voters.");
        }
        int generated = voterDataGenerator.generateFakeVoters(count);
        return ResponseEntity.ok("Generated " + generated + " voters. DB count: " + voterRollRepository.count());
    }

    @PostMapping("/generate-voters")
    public ResponseEntity<?> generateVoters(
            @RequestParam(defaultValue = "100000") int count,
            @RequestHeader("X-Admin-Secret") String secret) {

        if (!adminSecret.equals(secret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");
        }
        int generated = voterDataGenerator.generateFakeVoters(count);
        return ResponseEntity.ok("Generated " + generated + " voters successfully");
    }

    @GetMapping("/fix-party-images")
    public ResponseEntity<?> fixPartyImages() {
        Map<String, String[]> imageMap = Map.of(
            "BJP", new String[]{"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/BJP_symbol.svg/240px-BJP_symbol.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Modi_cropped.jpg/260px-Modi_cropped.jpg"},
            "INC", new String[]{"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Indian_National_Congress_hand_logo.svg/240px-Indian_National_Congress_hand_logo.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Rahul_Gandhi.jpg/260px-Rahul_Gandhi.jpg"},
            "AAP", new String[]{"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Aam_Aadmi_Party_logo.svg/240px-Aam_Aadmi_Party_logo.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Arvind_Kejriwal_2020.jpg/260px-Arvind_Kejriwal_2020.jpg"},
            "SAD", new String[]{"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Shiromani_Akali_Dal_logo.svg/240px-Shiromani_Akali_Dal_logo.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sukhbir_Singh_Badal.jpg/260px-Sukhbir_Singh_Badal.jpg"}
        );

        int updated = 0;
        for (Party p : partyRepository.findAll()) {
            String[] imgs = imageMap.get(p.getName());
            if (imgs != null) {
                p.setImg(imgs[0]);
                p.setCandidateImg(imgs[1]);
                partyRepository.save(p);
                updated++;
            }
        }
        return ResponseEntity.ok("Updated images for " + updated + " parties.");
    }

    @GetMapping("/seed-constituencies")
    public ResponseEntity<?> seedConstituenciesAndParties() {
        Object[][] constituencies = {
            {1L, "Ludhiana East"}, {2L, "Ludhiana West"}, {3L, "Ludhiana North"},
            {4L, "Ludhiana South"}, {5L, "Ludhiana Central"}, {6L, "Atam Nagar"},
            {7L, "Amritsar North"}, {8L, "Amritsar South"},
            {9L, "Jalandhar North"}, {10L, "Jalandhar Central"}, {11L, "Patiala"}
        };

        String[][] parties = {
            {"BJP",  "Narendra Modi",   "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/BJP_symbol.svg/240px-BJP_symbol.svg.png",        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Modi_cropped.jpg/220px-Modi_cropped.jpg"},
            {"INC",  "Rahul Gandhi",    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Indian_National_Congress_hand_logo.svg/240px-Indian_National_Congress_hand_logo.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Rahul_Gandhi.jpg/220px-Rahul_Gandhi.jpg"},
            {"AAP",  "Arvind Kejriwal", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Aam_Aadmi_Party_logo.svg/240px-Aam_Aadmi_Party_logo.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Arvind_Kejriwal_2020.jpg/220px-Arvind_Kejriwal_2020.jpg"},
            {"SAD",  "Sukhbir Badal",   "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Shiromani_Akali_Dal_logo.svg/240px-Shiromani_Akali_Dal_logo.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sukhbir_Singh_Badal.jpg/220px-Sukhbir_Singh_Badal.jpg"},
        };

        int addedC = 0, addedP = 0;
        for (Object[] cd : constituencies) {
            Long cId = (Long) cd[0];
            if (constituencyRepository.existsById(cId)) continue; // skip existing

            Constituency c = new Constituency();
            c.setId(cId);
            c.setName((String) cd[1]);
            c.setState("Punjab");
            c.setElectionActive(true);
            c.setDOLS(LocalDate.now());
            constituencyRepository.save(c);
            addedC++;

            for (String[] pd : parties) {
                Party p = new Party();
                p.setName(pd[0]);
                p.setCandidateName(pd[1]);
                p.setImg(pd[2]);
                p.setCandidateImg(pd[3]);
                p.setNumberOfVotes(0L);
                p.setConstituency(c);
                partyRepository.save(p);
                addedP++;
            }
        }

        return ResponseEntity.ok("Added " + addedC + " new constituencies and " + addedP + " parties. Total now: "
            + constituencyRepository.count() + " constituencies, " + partyRepository.count() + " parties.");
    }
}
