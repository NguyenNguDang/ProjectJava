package com.example.infertility_care.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name ="roles")
public class RoleEntity {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@Column(name="rolename", nullable = false, unique = true)
	private String roleName;
	
	@Column(name="description")
	private String Description;
}
