package com.System.Claims.state;

import com.System.Claims.model.Claim;
import com.System.Claims.model.ClaimStatus;
import com.System.Claims.model.Priority;

public interface ClaimState {

    public void assignPriority(Claim claim, Priority priority);

    public void resolve(Claim claim);

    public void close(Claim claim);

    public ClaimStatus toStatus();

}
