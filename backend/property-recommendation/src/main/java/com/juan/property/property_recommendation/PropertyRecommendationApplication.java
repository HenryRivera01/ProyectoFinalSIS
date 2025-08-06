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

}
