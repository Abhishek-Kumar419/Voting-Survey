package com.election.votingsurvey.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.election.votingsurvey.dao.PartysDao;
import com.election.votingsurvey.entity.Constituency;
import com.election.votingsurvey.entity.Party;

@Service
public class PartyService implements PartysService {
	
	@Autowired
	private PartysDao dao;
	
	@Autowired
    private ConstituencysService constituencysService;

	@Override
	public Party saveParty(Party party) {
		if (party.getConstituency() == null || party.getConstituency().getId() == null) {
			throw new RuntimeException("Constituency ID is required");
		}
		Optional<Constituency> constituencyOpt = constituencysService.getConstituencyById(party.getConstituency().getId());
		if (!constituencyOpt.isPresent()) {
			throw new RuntimeException("Constituency not found with ID: " + party.getConstituency().getId());
		}
		party.setConstituency(constituencyOpt.get());
		return dao.savePartyDao(party);
	}

	@Override
	public List<Party> getAllPartys() {
		return dao.getAllPartysDao();
	}

	@Override
	public List<Party> getPartiesByConstituency(Long constituencyId) {
		return dao.getPartiesByConstituencyDao(constituencyId);
	}

	@Override
	public boolean deletePartyByIdDao(Long Id) {
		return dao.deletePartyByIdDao(Id);
	}

//	@Override
//	public List<Party> getAllPartysByActiveConstituenciesNumber() {
//	    List<Constituency> activeConstituencies = constituencysService.getActiveConstituencies();
//	    if (activeConstituencies.isEmpty()) return List.of();
//	    Long constituencyId = activeConstituencies.get(0).getId();
//	    return getPartiesByConstituency(constituencyId);
//	}
	
	@Override
	public List<Party> getAllPartysByActiveConstituenciesNumber() {
		return dao.getActiveElectionPartiesDao();
	}
	



	@Override
	@Cacheable("activeParties")
	public List<Party> getActiveElectionParties() {
		return dao.getActiveElectionPartiesDao();
	}

	@Override
	@CacheEvict(value = "activeParties", allEntries = true)
	public boolean updateVotes(Long partyId, Long newVotes) {
		 return dao.updateVotesDao(partyId, newVotes);
	}

	@Override
	public List<Party> getPartiesByConstituencyIdOrName(Long constituencyId, String constituencyName) {
		
		if (constituencyId != null) {
            return dao.getPartiesByConstituencyDao(constituencyId);
        } else if (constituencyName != null && !constituencyName.isEmpty()) {
            return dao.getPartiesByConstituencyNameDao(constituencyName);
        }
        return List.of(); // Return empty list if both are null
	}

	@Override
	public String resetAllPartyVotesByConstituencyId(Long constituencyId) {
		int updateStatus = dao.resetAllPartyVotesByConstituencyIdDao(constituencyId);
		return updateStatus >0 ?  "All votes reset successfully." : "Error: No parties found in this constituency.";
		
	}

	@Override
	public Party updateParty(Party party) {
		if (party == null || party.getId() <= 0) {
			throw new RuntimeException("Party id must be provided for update.");
		}

		Optional<Party> existing = dao.getAllPartysDao().stream()
				.filter(p -> p.getId() == party.getId())
				.findFirst();

		if (!existing.isPresent()) {
			throw new RuntimeException("Party not found with id: " + party.getId());
		}

		Party updateParty = existing.get();
		// You can decide which fields are updatable
		updateParty.setName(party.getName());
		updateParty.setCandidateName(party.getCandidateName());
		updateParty.setNumberOfVotes(party.getNumberOfVotes());
		updateParty.setImg(party.getImg());
		updateParty.setCandidateImg(party.getCandidateImg());
		if (party.getConstituency() != null && party.getConstituency().getId() != null) {
			updateParty.setConstituency(party.getConstituency());
		}

		return dao.updatePartyDao(updateParty);
	}
}

