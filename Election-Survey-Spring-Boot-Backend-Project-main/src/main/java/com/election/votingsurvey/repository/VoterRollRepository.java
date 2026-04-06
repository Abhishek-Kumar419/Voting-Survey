package com.election.votingsurvey.repository;

import com.election.votingsurvey.entity.VoterRoll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoterRollRepository extends JpaRepository<VoterRoll, Long> {

    boolean existsByVoterId(Long voterId);

    List<VoterRoll> findByNameContainingIgnoreCaseAndDob(String name, String dob);

    Optional<VoterRoll> findByVoterIdAndDob(Long voterId, String dob);
}
