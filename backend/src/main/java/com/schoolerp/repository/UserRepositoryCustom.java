package com.schoolerp.repository;

import com.schoolerp.model.Role;
import com.schoolerp.model.User;

import java.util.List;

public interface UserRepositoryCustom {
    List<User> findByRole(Role role);
}

