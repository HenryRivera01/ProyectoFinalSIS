package com.juan.property.property_recommendation.location;

import com.juan.property.property_recommendation.location.dto.CityResponse;
import com.juan.property.property_recommendation.location.dto.DepartmentResponse;
import com.juan.property.property_recommendation.location.service.LocationService;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/location")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/departments")
    @ResponseStatus(HttpStatus.OK)
    public List<DepartmentResponse> departments() {
        return  locationService.findAllDepartment();
    }


    @GetMapping("/departments/{id}/cities")
    @ResponseStatus(HttpStatus.OK)
    public List<CityResponse> cities(@PathVariable Integer id) {
        return locationService.findAllCitiesByDepartmentId(id);

    }

}
