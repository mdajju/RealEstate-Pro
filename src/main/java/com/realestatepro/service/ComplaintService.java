package com.realestatepro.service;

import java.util.List;

import com.realestatepro.dto.request.ComplaintRequest;
import com.realestatepro.dto.response.ComplaintResponse;

public interface ComplaintService {

    ComplaintResponse createComplaint(ComplaintRequest request);

    ComplaintResponse getComplaintById(String complaintId);

    List<ComplaintResponse> getComplaintsByUser(String userId);

    List<ComplaintResponse> getAllComplaints();

    ComplaintResponse updateComplaintStatus(
            String complaintId,
            String status,
            String adminRemark
    );

}