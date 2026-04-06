package com.election.votingsurvey;

import com.election.votingsurvey.entity.Constituency;
import com.election.votingsurvey.entity.Party;
import com.election.votingsurvey.entity.VoterRoll;
import com.election.votingsurvey.repository.ConstituencyRepository;
import com.election.votingsurvey.repository.PartyRepository;
import com.election.votingsurvey.repository.VoterRollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private VoterRollRepository voterRollRepository;
    @Autowired private ConstituencyRepository constituencyRepository;
    @Autowired private PartyRepository partyRepository;

    // Must match VoterDataGenerator constituencies array exactly
    private static final Object[][] CONSTITUENCY_DATA = {
        {1L,  "Ludhiana East",     "Punjab"},
        {2L,  "Ludhiana West",     "Punjab"},
        {3L,  "Ludhiana North",    "Punjab"},
        {4L,  "Ludhiana South",    "Punjab"},
        {5L,  "Ludhiana Central",  "Punjab"},
        {6L,  "Atam Nagar",        "Punjab"},
        {7L,  "Amritsar North",    "Punjab"},
        {8L,  "Amritsar South",    "Punjab"},
        {9L,  "Jalandhar North",   "Punjab"},
        {10L, "Jalandhar Central", "Punjab"},
        {11L, "Patiala",           "Punjab"},
    };

    private static final String[][] PARTIES = {
        {"BJP",  "Narendra Modi",   "https://tse2.mm.bing.net/th/id/OIP.53bSgHop7Rw7VMVwi2PU7gHaH6?pid=Api&P=0&h=180", "https://media.assettype.com/sentinelassam-english/2026-01-26/w6nyejdk/Narendra-Modi.webp?w=1200&ar=40:21&auto=format%2Ccompress&ogImage=true&mode=crop&enlarge=true&overlay=false&overlay_position=bottom&overlay_width=100"},
        {"INC",  "Rahul Gandhi",    "https://tse2.mm.bing.net/th/id/OIP.7gBsmyboxHJsRCp6Yf0kpwHaE2?pid=Api&P=0&h=180", "https://tse2.mm.bing.net/th/id/OIP.QJBtpk5ZwqsCSVBS6_S-uQHaEK?pid=Api&P=0&h=180"},
        {"AAP",  "Arvind Kejriwal", "https://tse3.mm.bing.net/th/id/OIP.WExtSFlcjlLts4SAE9SVcQHaFO?pid=Api&P=0&h=180", "https://d2e1hu1ktur9ur.cloudfront.net/wp-content/uploads/2025/02/Arvind-Kejriwal-4.jpg"},
        {"SAD",  "Sukhbir Badal",   "https://tse3.mm.bing.net/th/id/OIP.-zgU1kJkApXOESdrlzBjoAHaE8?pid=Api&P=0&h=180", "https://tse4.mm.bing.net/th/id/OIP.jZycuWr34gEvfXTIMVsmnAHaEc?pid=Api&P=0&h=180"},
    };

    @Override
    public void run(String... args) {
        try {
            seedConstituenciesAndParties();
            seedVoters();
        } catch (Exception e) {
            System.err.println(">>> DataInitializer FAILED: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Transactional
    private void seedConstituenciesAndParties() {
        if (constituencyRepository.count() > 0) {
            System.out.println(">>> Constituencies already seeded: " + constituencyRepository.count());
            return;
        }

        System.out.println(">>> Seeding constituencies and parties...");
        for (Object[] cd : CONSTITUENCY_DATA) {
            Constituency c = new Constituency();
            c.setId((Long) cd[0]);
            c.setName((String) cd[1]);
            c.setState((String) cd[2]);
            c.setElectionActive(true);
            c.setDOLS(LocalDate.now());
            constituencyRepository.save(c);

            for (String[] pd : PARTIES) {
                Party p = new Party();
                p.setName(pd[0]);
                p.setCandidateName(pd[1]);
                p.setImg(pd[2]);
                p.setCandidateImg(pd[3]);
                p.setNumberOfVotes(0L);
                p.setConstituency(c);
                partyRepository.save(p);
            }
        }
        System.out.println(">>> Seeded " + constituencyRepository.count() + " constituencies with " + partyRepository.count() + " parties.");
    }

    private void seedVoters() {
        long existing = voterRollRepository.count();
        System.out.println(">>> voter_roll count = " + existing);
        if (existing > 0) {
            System.out.println(">>> Voter roll already loaded: " + existing + " voters.");
            return;
        }

        System.out.println("========================================");
        System.out.println(" Voter roll empty. Generating data...  ");
        System.out.println("========================================");

        String[] constituencyNames = Arrays.stream(CONSTITUENCY_DATA)
            .map(cd -> (String) cd[1])
            .toArray(String[]::new);

        String[] maleNames   = {"Rajesh","Amit","Vikram","Rohit","Suresh","Arjun","Harpreet","Gurpreet","Sandeep","Manpreet","Jaswinder","Kulwinder","Balwinder","Paramjit","Navdeep","Satinder"};
        String[] femaleNames = {"Priya","Sunita","Neha","Kavita","Anjali","Simran","Gurpreet","Harpreet","Manpreet","Parminder","Navneet","Kulwinder","Jasvir","Rupinder","Satinder","Navjot"};
        String[] lastNames   = {"Kumar","Sharma","Singh","Verma","Gupta","Kaur","Mehta","Yadav","Joshi","Malhotra","Kapoor","Sandhu","Gill","Dhillon","Grewal","Sidhu","Brar"};
        String[] streets     = {"Civil Lines","Model Town","Sarabha Nagar","BRS Nagar","Gurdev Nagar","Shastri Nagar","Rajguru Nagar","Dugri Road","Ferozepur Road","GT Road","Miller Ganj"};

        Random random = new Random(42L); // fixed seed = same data every run
        List<VoterRoll> batch = new ArrayList<>();
        int generated = 0;

        for (int i = 1; i <= 1000; i++) {
            String gender = random.nextBoolean() ? "M" : "F";
            String[] pool = gender.equals("M") ? maleNames : femaleNames;

            VoterRoll voter = new VoterRoll();
            voter.setVoterId(1000000L + i);
            voter.setName(pool[random.nextInt(pool.length)] + " " + lastNames[random.nextInt(lastNames.length)]);
            voter.setGender(gender);
            voter.setConstituencyName(constituencyNames[random.nextInt(constituencyNames.length)]);
            voter.setDob(randomDob(random));
            voter.setAddress((random.nextInt(999) + 1) + ", " + streets[random.nextInt(streets.length)] + ", Punjab");
            voter.setIsEligible(true);
            voter.setIsRegistered(false);
            batch.add(voter);
            generated++;

            if (batch.size() == 100) {
                try {
                    voterRollRepository.saveAll(batch);
                    voterRollRepository.flush();
                    batch.clear();
                    System.out.println("  >>> " + generated + " voters inserted. DB count: " + voterRollRepository.count());
                } catch (Exception e) {
                    System.err.println("  >>> Batch save FAILED at " + generated + ": " + e.getMessage());
                    batch.clear();
                }
            }
        }

        if (!batch.isEmpty()) voterRollRepository.saveAll(batch);

        System.out.println(">>> Final count in DB: " + voterRollRepository.count());
        System.out.println("========================================");
        System.out.println(" Voter roll ready! Generated: " + generated);
        System.out.println("========================================");
    }

    private String randomDob(Random random) {
        int year  = 1944 + random.nextInt(62);
        int month = 1 + random.nextInt(12);
        int day   = 1 + random.nextInt(28);
        return String.format("%04d-%02d-%02d", year, month, day);
    }
}
