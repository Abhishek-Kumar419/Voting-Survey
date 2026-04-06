package com.election.votingsurvey.services;

import com.election.votingsurvey.entity.VoterRoll;
import com.election.votingsurvey.repository.VoterRollRepository;
import com.opencsv.CSVReader;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class VoterRollImportService {

    @Autowired
    private VoterRollRepository voterRollRepository;

    // CSV column order: voterId, name, gender, dob, address, constituencyName

    @Transactional
    public ImportResult importFromCsv(MultipartFile file) throws Exception {
        ImportResult result = new ImportResult();
        List<VoterRoll> batch = new ArrayList<>();

        CSVReader csvReader = new CSVReader(
            new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8)
        );

        String[] line;
        boolean firstLine = true;
        int lineNumber = 0;

        while ((line = csvReader.readNext()) != null) {
            lineNumber++;
            if (firstLine) { firstLine = false; continue; }

            try {
                if (line.length < 6) throw new Exception("Need 6 columns, got " + line.length);

                VoterRoll voter = new VoterRoll();
                voter.setVoterId(Long.parseLong(line[0].trim()));
                voter.setName(line[1].trim());
                voter.setGender(line[2].trim());
                voter.setDob(line[3].trim());
                voter.setAddress(line[4].trim());
                voter.setConstituencyName(line[5].trim());
                voter.setIsEligible(true);
                voter.setIsRegistered(false);
                batch.add(voter);
                result.success++;

            } catch (Exception e) {
                result.failed++;
                result.errors.add("Row " + lineNumber + ": " + e.getMessage());
            }

            if (batch.size() == 1000) {
                voterRollRepository.saveAll(batch);
                batch.clear();
            }
        }

        if (!batch.isEmpty()) voterRollRepository.saveAll(batch);
        result.total = result.success + result.failed;
        csvReader.close();
        return result;
    }

    @Data
    public static class ImportResult {
        int total;
        int success;
        int failed;
        List<String> errors = new ArrayList<>();
    }
}
