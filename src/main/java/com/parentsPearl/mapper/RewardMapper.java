package com.parentsPearl.mapper;

import com.parentsPearl.dto.request.RewardRequest;
import com.parentsPearl.dto.response.RewardResponse;
import com.parentsPearl.model.Reward;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RewardMapper {
    
    @Mapping(target = "claimedById", source = "claimedBy.id")
    @Mapping(target = "claimedByName", expression = "java(reward.getClaimedBy() != null ? reward.getClaimedBy().getFirstName() + \" \" + reward.getClaimedBy().getLastName() : null)")
    RewardResponse toResponse(Reward reward);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "claimedBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Reward toEntity(RewardRequest request);
} 