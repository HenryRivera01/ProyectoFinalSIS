package com.juan.property.property_recommendation.location;

import com.juan.property.property_recommendation.location.dto.CityResponse;
import com.juan.property.property_recommendation.location.dto.DepartmentResponse;
import com.juan.property.property_recommendation.location.service.LocationService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/location")
@AllArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/departments")
    public List<DepartmentResponse> departments() {
        return  locationService.findAllDepartment();
    }


    @GetMapping("/departments/{id}/cities")
    public List<CityResponse> cities(@PathVariable Integer id) {
        return locationService.findAllCitiesByDepartmentId(id);

    }

}
