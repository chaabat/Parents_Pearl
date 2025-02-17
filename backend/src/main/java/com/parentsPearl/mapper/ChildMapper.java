package com.parentsPearl.mapper;

import com.parentsPearl.dto.request.ChildRequest;
import com.parentsPearl.dto.response.ChildResponse;
import com.parentsPearl.model.Child;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ChildMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "points", ignore = true)
    Child toEntity(ChildRequest request);
    
    @Mapping(target = "parentName", expression = "java(child.getParent() != null ? child.getParent().getFirstName() + ' ' + child.getParent().getLastName() : null)")
    ChildResponse toResponse(Child child);

    default String mapInterests(List<String> interests) {
        return interests != null ? String.join(", ", interests) : null;
    }
} 