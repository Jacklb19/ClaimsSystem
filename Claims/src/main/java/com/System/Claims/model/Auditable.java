package com.System.Claims.model;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.repository.NoRepositoryBean;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
public abstract class Auditable {

    @Id
    private String id;


    @CreatedDate
    private Instant createdDate;

    @LastModifiedDate
    private Instant updatedAt;

}