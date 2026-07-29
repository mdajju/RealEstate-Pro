package com.realestatepro.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.realestatepro.entity.Complaint;
import com.realestatepro.enums.ComplaintStatus;

@Repository
public interface ComplaintRepository extends MongoRepository<Complaint, String> {

    List<Complaint> findByUserId(String userId);

    List<Complaint> findByAgainstUserId(String againstUserId);

    List<Complaint> findByPropertyId(String propertyId);

    List<Complaint> findByStatus(ComplaintStatus status);

    List<Complaint> findByUserIdAndStatus(
            String userId,
            ComplaintStatus status
    );

    long countByStatus(ComplaintStatus status);
}