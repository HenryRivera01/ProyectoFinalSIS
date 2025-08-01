package com.juan.property.property_recommendation.location;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.juan.property.property_recommendation.location.dto.DepartmentData;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class LocationReeder  implements CommandLineRunner {
    private final DepartmentRepository departmentRepository;

    @Override
    public void run(String... args) throws Exception {
        if (departmentRepository.count() == 0) {
            // Leer archivo JSON
            InputStream input = getClass().getResourceAsStream("/data/colombia.json");
            ObjectMapper mapper = new ObjectMapper();
            List<DepartmentData> data = Arrays.asList(
                    mapper.readValue(input, DepartmentData[].class)
            );

            // Mapear y guardar
            for (DepartmentData dto : data) {
                Department dept = new Department();
                dept.setName(dto.getDepartamento());

                List<City> cities = dto.getCiudades().stream().map(cityName -> {
                    City city = new City();
                    city.setName(cityName);
                    city.setDepartment(dept);
                    return city;
                }).collect(Collectors.toList());

                dept.setCities(cities);
                departmentRepository.save(dept); // guarda cascada
            }

            System.out.println("🟢 Departamentos y ciudades cargados");
        }
    }

}
