package com.System.Claims.dto;

import com.System.Claims.model.ClaimStatus;
import com.System.Claims.model.ClaimType;
import com.System.Claims.model.Priority;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ResponseClaimDto {

    private String owner;
    private String id;
    private String title;
    private String description;
    private ClaimType type;
    private Priority priority;
    private ClaimStatus status;
    private Instant createdDate;
    private Instant updateDate;

}
