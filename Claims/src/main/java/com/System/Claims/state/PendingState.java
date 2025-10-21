package com.System.Claims.state;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.System.Claims.model.Claim;
import com.System.Claims.model.ClaimStatus;
import com.System.Claims.model.Priority;

public class PendingState implements ClaimState {
    @Override
    public void assignPriority(Claim claim, Priority priority) {
        claim.setPriority(priority);
    }

    @Override
    public void resolve(Claim claim) {
        claim.setState(new InProcessState());
    }

    @Override
    public void close(Claim claim) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"No se puede cerrar un reclamo que está pendiente");
    }

    @Override
    public ClaimStatus toStatus() {
        return ClaimStatus.PENDING;
    }
}
