package com.System.Claims.dto;

import com.System.Claims.model.ClaimStatus;
import com.System.Claims.model.Priority;
import lombok.Data;

@Data
public class UpdateClaimDto {

    private String description;
    private Priority priority;
    private ClaimStatus status;
}
