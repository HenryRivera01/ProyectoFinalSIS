package com.juan.property.property_recommendation;

import com.juan.property.property_recommendation.location.City;
import com.juan.property.property_recommendation.location.CityRepository;
import com.juan.property.property_recommendation.location.Department;
import com.juan.property.property_recommendation.location.DepartmentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class PropertyRecommendationApplication {

	public static void main(String[] args) {

		SpringApplication.run(PropertyRecommendationApplication.class, args);


	}

	@Bean
	public CommandLineRunner runner(
			DepartmentRepository departmentRepository
			//sCityRepository cityRepository
	){
		return args -> {
//			if(roleRepository.findByName(RoleName.EMPLOYEE).isEmpty()) {
//				roleRepository.save(Role.builder().name(RoleName.EMPLOYEE).build());
//			}
//			if(roleRepository.findByName(RoleName.ADMIN).isEmpty()) {
//				roleRepository.save(Role.builder().name(RoleName.ADMIN).build());
//			}
//			var provider = Provider.builder()
//					.name("Proveedor Ejemplo")
//					.phone(3124567890L)
//					.address("Calle 123 #45-67")
//					.email("proveedor@ejemplo.com")
//					.build();
//			providerRepository.save(provider);

//			var department = Department.builder()
//					.name("Cundinamarca")
//					.build();
//
//			var city = City.builder()
//					.name("Bogotá")
//					.build();
//
//
//			city.setDepartment(department);
//			department.setCities(List.of(city));
//
//			departmentRepository.save(department);


		};

	}

}
