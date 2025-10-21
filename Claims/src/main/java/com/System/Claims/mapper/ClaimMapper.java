package com.System.Claims.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import com.System.Claims.dto.CreateClaimDto;
import com.System.Claims.dto.UpdateClaimDto;
import com.System.Claims.dto.ResponseClaimDto;
import com.System.Claims.model.Claim;


@Mapper(componentModel = "spring")
public interface ClaimMapper {

    @Mapping(target = "owner", expression = "java(owner)")
    @Mapping(target = "status", constant = "PENDING")
    Claim toEntity(CreateClaimDto dto, @Context String owner);

    ResponseClaimDto toDto(Claim claim);

    @org.mapstruct.BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    void updateFromDto(UpdateClaimDto dto, @MappingTarget Claim entity);

}
