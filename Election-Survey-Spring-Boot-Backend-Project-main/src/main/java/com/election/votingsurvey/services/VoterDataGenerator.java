package com.election.votingsurvey.services;

import com.election.votingsurvey.entity.VoterRoll;
import com.election.votingsurvey.repository.VoterRollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class VoterDataGenerator {

    @Autowired
    private VoterRollRepository voterRollRepository;

    private final String[] constituencies = {
        "Ludhiana East", "Ludhiana West", "Ludhiana North",
        "Ludhiana South", "Ludhiana Central", "Atam Nagar",
        "Amritsar North", "Amritsar South",
        "Jalandhar North", "Jalandhar Central", "Patiala"
    };

    private final String[] maleFirstNames = {
        "Rajesh", "Amit", "Vikram", "Rohit", "Suresh", "Arjun",
        "Harpreet", "Gurpreet", "Sandeep", "Manpreet", "Jaswinder",
        "Kulwinder", "Balwinder", "Paramjit", "Navdeep", "Satinder"
    };

    private final String[] femaleFirstNames = {
        "Priya", "Sunita", "Neha", "Kavita", "Anjali", "Simran",
        "Gurpreet", "Harpreet", "Manpreet", "Parminder", "Navneet",
        "Kulwinder", "Jasvir", "Rupinder", "Satinder", "Navjot"
    };

    private final String[] lastNames = {
        "Kumar", "Sharma", "Singh", "Verma", "Gupta", "Kaur",
        "Mehta", "Yadav", "Joshi", "Malhotra", "Kapoor",
        "Sandhu", "Gill", "Dhillon", "Grewal", "Sidhu", "Brar"
    };

    private final String[] streets = {
        "Civil Lines", "Model Town", "Sarabha Nagar", "BRS Nagar",
        "Gurdev Nagar", "Shastri Nagar", "Rajguru Nagar",
        "Dugri Road", "Ferozepur Road", "GT Road", "Miller Ganj"
    };

    public int generateFakeVoters(int count) {
        Random random = new Random();
        int generated = 0;

        System.out.println(">>> Starting voter generation: " + count + " voters...");

        List<VoterRoll> batch = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            long voterId = 1000000L + i;

            String gender = random.nextBoolean() ? "M" : "F";
            String[] pool = gender.equals("M") ? maleFirstNames : femaleFirstNames;
            String name = pool[random.nextInt(pool.length)] + " "
                        + lastNames[random.nextInt(lastNames.length)];

            VoterRoll voter = new VoterRoll();
            voter.setVoterId(voterId);
            voter.setName(name);
            voter.setGender(gender);
            voter.setConstituencyName(constituencies[random.nextInt(constituencies.length)]);
            voter.setDob(randomDob(random));
            voter.setAddress((random.nextInt(999) + 1) + ", "
                           + streets[random.nextInt(streets.length)] + ", Punjab");
            voter.setIsEligible(true);
            voter.setIsRegistered(false);
            batch.add(voter);
            generated++;

            if (batch.size() == 100) {
                saveBatch(batch);
                batch.clear();
                System.out.println("  >>> " + generated + " voters inserted...");
            }
        }

        if (!batch.isEmpty()) saveBatch(batch);

        System.out.println(">>> Generation complete. Total: " + generated);
        return generated;
    }

    @Transactional
    public void saveBatch(List<VoterRoll> batch) {
        voterRollRepository.saveAll(batch);
    }

    private String randomDob(Random random) {
        int year  = 1944 + random.nextInt(62);
        int month = 1 + random.nextInt(12);
        int day   = 1 + random.nextInt(28);
        return String.format("%04d-%02d-%02d", year, month, day);
    }
}
