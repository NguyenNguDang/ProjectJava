package com.example.infertility_care.service;

import com.example.infertility_care.model.request.CreateUserRequest;
import com.example.infertility_care.model.request.UpdateUserRequest;

public interface IUserService {
	public void createUser(CreateUserRequest request);
	public void updateUser(UpdateUserRequest request);
	public void deleteUser(Long id);
}
