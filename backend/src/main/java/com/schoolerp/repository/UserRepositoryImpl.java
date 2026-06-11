package com.schoolerp.repository;

import com.schoolerp.model.Role;
import com.schoolerp.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepositoryImpl implements UserRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<User> findByRole(Role role) {
        TypedQuery<User> query = entityManager.createQuery(
            "select u from User u where u.role = :role", User.class
        );
        query.setParameter("role", role);
        return query.getResultList();
    }
}

