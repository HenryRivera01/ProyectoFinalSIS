package com.juan.property.property_recommendation.find_all_departments;

import com.juan.property.property_recommendation.location.Department;
import com.juan.property.property_recommendation.location.DepartmentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
public class FindAllDepartmentsRepository {

    @Autowired
    private DepartmentRepository departmentRepository;



    @Test
    @DisplayName("Buscar todos los departamentos")
    void findAllDepartments() {
        Department d1 = Department.builder().name("Cundinamarca").build();
        Department d2 = Department.builder().name("Antioquia").build();

        departmentRepository.save(d1);
        departmentRepository.save(d2);

        List<Department> departments = departmentRepository.findAll();

        assertThat(departments.size()).isEqualTo(2);
    }
}
