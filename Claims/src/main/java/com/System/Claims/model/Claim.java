package com.System.Claims.model;


import com.System.Claims.state.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;


@EqualsAndHashCode(callSuper = true)
@Document(collection = "claims")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Claim extends Auditable {


    private ClaimType type;
    private String description;
    private ClaimStatus status;
    private Priority priority;
    private String title;
    private transient ClaimState state;
    private String owner;

    public void assignPriority(Priority priority) {
        getState().assignPriority(this, priority);
    }

    public void resolve(){
        getState().resolve(this);
    }

    public void close(){
        getState().close(this);
    }

    public ClaimState getState() {
        if (state == null) {
            switch (status) {
                case PENDING -> state = new PendingState();
                case IN_PROCESS -> state = new InProcessState();
                case RESOLVED -> state = new ResolvedState();
                case CLOSED -> state = new ClosedState();
            }
        }
        return state;
    }

    public void setState(ClaimState newState) {
        this.state = newState;
        this.status = newState.toStatus();
    }

}
