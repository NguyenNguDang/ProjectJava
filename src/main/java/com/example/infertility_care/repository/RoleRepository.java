package com.example.infertility_care.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.infertility_care.entity.RoleEntity;

public interface RoleRepository extends JpaRepository<RoleEntity, Long>{
	Set<RoleEntity> findByNameIn(Set<String> names);
}
