package com.juan.property.property_recommendation.location.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentData {
    private Long id;
    private String departamento;
    private List<String> ciudades;
}
