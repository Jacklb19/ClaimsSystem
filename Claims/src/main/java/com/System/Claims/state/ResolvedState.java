package com.System.Claims.state;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.System.Claims.model.Claim;
import com.System.Claims.model.ClaimStatus;
import com.System.Claims.model.Priority;

public class ResolvedState implements ClaimState{
    @Override
    public void assignPriority(Claim claim, Priority priority) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"No se puede cambiar la prioridad una vez resuelto");
    }

    @Override
    public void resolve(Claim claim) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"El reclamo ya está resuelto");
    }

    @Override
    public void close(Claim claim) {
        claim.setState(new ClosedState());
    }

    @Override
    public ClaimStatus toStatus() {
        return ClaimStatus.RESOLVED;
    }
}
