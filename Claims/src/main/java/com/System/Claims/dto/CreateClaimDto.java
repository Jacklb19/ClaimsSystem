package com.System.Claims.dto;

import com.System.Claims.model.ClaimType;
import com.System.Claims.model.Priority;
import lombok.Data;

@Data
public class CreateClaimDto {

    private String title;
    private ClaimType type;
    private String description;
    private Priority priority;

}
