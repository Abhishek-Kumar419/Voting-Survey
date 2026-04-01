package com.election.votingsurvey.repository;

import com.election.votingsurvey.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByVoterId(Long voterId);
    Optional<User> findByEmail(String email);
    boolean existsByVoterId(Long voterId);
    boolean existsByEmail(String email);
}
