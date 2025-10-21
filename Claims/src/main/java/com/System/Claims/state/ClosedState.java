package com.System.Claims.state;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.System.Claims.model.Claim;
import com.System.Claims.model.ClaimStatus;
import com.System.Claims.model.Priority;

public class ClosedState implements ClaimState{
    @Override
    public void assignPriority(Claim claim, Priority priority) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"No se puede cambiar la prioridad una vez cerrado");
    }

    @Override
    public void resolve(Claim claim) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"No se puede resolver un reclamo cerrado");
    }

    @Override
    public void close(Claim claim) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"El reclamo ya está cerrado");
    }

    @Override
    public ClaimStatus toStatus() {
        return ClaimStatus.CLOSED;
    }
}
