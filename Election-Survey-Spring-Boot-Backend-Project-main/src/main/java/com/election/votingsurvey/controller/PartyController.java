package com.election.votingsurvey.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.election.votingsurvey.entity.Party;
import com.election.votingsurvey.services.PartysService;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping(value = "/api/party")
@CrossOrigin(value = {"http://localhost:5173", "http://localhost:5174"})
public class PartyController {

	@Autowired
	private PartysService service;

	@PostMapping
	public ResponseEntity<?> savePartyController(@RequestBody Party party) {
		try {
			return ResponseEntity.ok(service.saveParty(party));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping
	public List<Party> getAllPartyscontroller() {
		return service.getAllPartys();
	}

	@GetMapping(value = "/constituency-number/{constituencyId}")
	public List<Party> getPartiesByConstituency(@PathVariable Long constituencyId) {
		return service.getPartiesByConstituency(constituencyId);
	}

	@GetMapping(value = "/activeConstituenciePartys")
	public List<Party> getAllPartysByActiveConstituenciesNumberController() {
		return service.getAllPartysByActiveConstituenciesNumber();
	}

	@GetMapping(value = "/allActiveElectionParties")
	public ResponseEntity<List<Party>> getActiveElectionPartiesController() {
		List<Party> parties = service.getActiveElectionParties();
		return ResponseEntity.ok()
			.cacheControl(CacheControl.maxAge(5, TimeUnit.SECONDS))
			.body(parties);
	}

	@DeleteMapping(value = "/delete/{Id}")
	boolean deletePartyByIdDao(@PathVariable Long Id) {
		return service.deletePartyByIdDao(Id);
	}

	@PutMapping("/{partyId}/votes")
	public ResponseEntity<String> updatePartyVotes(@PathVariable Long partyId, @RequestParam Long votes) {
		boolean isUpdated = service.updateVotes(partyId, votes);
		return isUpdated ? ResponseEntity.ok("Votes updated successfully.") : ResponseEntity.badRequest().body("Failed to update votes.");
	}

	@PutMapping("/{partyId}")
	public ResponseEntity<?> updateParty(@PathVariable Long partyId, @RequestBody Party party) {
		try {
			party.setId(partyId);
			Party updated = service.updateParty(party);
			return ResponseEntity.ok(updated);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping("/byConstituencyIdOrName")
	public List<Party> getPartiesByConstituencyIdOrNameController(
			@RequestParam(required = false) Long constituencyId,
			@RequestParam(required = false) String constituencyName) {
		return service.getPartiesByConstituencyIdOrName(constituencyId, constituencyName);
	}

	@PutMapping("/resetVotes")
	public ResponseEntity<String> resetVotesByConstituencyId(@RequestParam Long constituencyId) {
		return ResponseEntity.ok(service.resetAllPartyVotesByConstituencyId(constituencyId));
	}
}
