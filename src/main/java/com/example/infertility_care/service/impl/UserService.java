package com.example.infertility_care.service.impl;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.infertility_care.entity.RoleEntity;
import com.example.infertility_care.entity.UserEntity;
import com.example.infertility_care.model.request.CreateUserRequest;
import com.example.infertility_care.model.request.UpdateUserRequest;
import com.example.infertility_care.repository.RoleRepository;
import com.example.infertility_care.repository.UserRepository;
import com.example.infertility_care.service.IUserService;

public class UserService implements IUserService {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private RoleRepository roleRepository;
	
	
	@Override
	public void createUser(CreateUserRequest request) {
		if (userRepository.findByEmail(request.getEmail()).isPresent()) {
			throw new RuntimeException("Email already exists.");
		}

		Set<RoleEntity> roles = roleRepository.findByNameIn(request.getRoles());
		if (roles.isEmpty()) {
			throw new RuntimeException("Invalid roles.");
		}

		UserEntity user = new UserEntity();
		user.setFullName(request.getFullName());
		user.setEmail(request.getEmail());
		user.setPhoneNumber(request.getPhone());
		user.setPassword(request.getPassword()); 
		user.setRoles(roles);
		userRepository.save(user);
	}
	
	@Override
	public void updateUser(UpdateUserRequest request) {
	    UserEntity user = userRepository.findById(request.getId())
	        .orElseThrow(() -> new RuntimeException("User not found"));

	    user.setFullName(request.getFullName());
	    user.setEmail(request.getEmail());
	    user.setPhoneNumber(request.getPhone());

	    // Gán lại roles nếu cần
	    Set<RoleEntity> roles = roleRepository.findByNameIn(request.getRoles());
	    user.setRoles(roles);

	    userRepository.save(user);
	}
	
	@Override
	public void deleteUser(Long id) {
	    UserEntity user = userRepository.findById(id)
	        .orElseThrow(() -> new RuntimeException("User not found"));
	    userRepository.delete(user);
	}

}
