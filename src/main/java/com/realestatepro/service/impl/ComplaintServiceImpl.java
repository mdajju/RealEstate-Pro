package com.realestatepro.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.realestatepro.dto.request.ComplaintRequest;
import com.realestatepro.dto.response.ComplaintResponse;
import com.realestatepro.entity.Complaint;
import com.realestatepro.enums.ComplaintStatus;
import com.realestatepro.exception.ResourceNotFoundException;
import com.realestatepro.repository.ComplaintRepository;
import com.realestatepro.repository.UserRepository;
import com.realestatepro.service.ComplaintService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;

    private final UserRepository userRepository;

    @Override
    public ComplaintResponse createComplaint(ComplaintRequest request) {

        userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        userRepository.findById(request.getAgainstUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Against user not found."));

        Complaint complaint = Complaint.builder()
                .userId(request.getUserId())
                .againstUserId(request.getAgainstUserId())
                .propertyId(request.getPropertyId())
                .title(request.getTitle())
                .description(request.getDescription())
                .status(ComplaintStatus.PENDING)
                .build();

        Complaint savedComplaint = complaintRepository.save(complaint);

        return mapToResponse(savedComplaint);
    }

    @Override
    public ComplaintResponse getComplaintById(String complaintId) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Complaint not found."));

        return mapToResponse(complaint);
    }

    @Override
    public List<ComplaintResponse> getComplaintsByUser(String userId) {

        userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        return complaintRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ComplaintResponse> getAllComplaints() {

        return complaintRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ComplaintResponse updateComplaintStatus(
            String complaintId,
            String status,
            String adminRemark) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Complaint not found."));

        complaint.setStatus(
                ComplaintStatus.valueOf(status.toUpperCase())
        );

        complaint.setAdminRemark(adminRemark);

        Complaint updatedComplaint = complaintRepository.save(complaint);

        return mapToResponse(updatedComplaint);
    }

    private ComplaintResponse mapToResponse(Complaint complaint) {

        return ComplaintResponse.builder()
                .id(complaint.getId())
                .userId(complaint.getUserId())
                .againstUserId(complaint.getAgainstUserId())
                .propertyId(complaint.getPropertyId())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .status(complaint.getStatus())
                .adminRemark(complaint.getAdminRemark())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .build();
    }
}