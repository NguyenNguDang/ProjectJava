package com.example.infertility_care.api.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.infertility_care.model.request.CreateUserRequest;
import com.example.infertility_care.model.request.UpdateUserRequest;
import com.example.infertility_care.service.impl.UserService;

@RestController
@RequestMapping("/api/admin/users")
public class UserAPI {
	@Autowired
	private UserService userService;
	
	
	//Create user
	@PostMapping
	public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
		userService.createUser(request);
		return ResponseEntity.ok("User created successfully");
	}
	
	//Update user
	@PutMapping("/{id}")
	public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
	    request.setId(id); 
	    userService.updateUser(request);
	    return ResponseEntity.ok("User updated successfully");
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable Long id) {
	    userService.deleteUser(id);
	    return ResponseEntity.ok("User deleted successfully");
	}

}
