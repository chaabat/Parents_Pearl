package com.parentPearl.dto.request;

 

import java.util.Date;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ChildRequest extends BaseUserRequest {
    @NotNull(message = "Parent ID is required")
    private Long parentId;

    private Date dateOfBirth;

}