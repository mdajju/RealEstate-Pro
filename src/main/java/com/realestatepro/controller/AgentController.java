package com.realestatepro.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.realestatepro.dto.request.AgentRequest;
import com.realestatepro.dto.response.AgentResponse;
import com.realestatepro.dto.response.ApiResponse;
import com.realestatepro.service.AgentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AgentController {



    private final AgentService agentService;




    /*
     * Create Agent Profile
     */
    @PostMapping
    public ResponseEntity<ApiResponse<AgentResponse>> createAgent(
            @Valid @RequestBody AgentRequest request) {



        AgentResponse response =
                agentService.createAgent(request);



        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<AgentResponse>builder()

                        .success(true)

                        .message(
                                "Agent created successfully"
                        )

                        .data(response)

                        .build()
                );

    }







    /*
     * Get Agent By Id
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AgentResponse>> getAgentById(
            @PathVariable String id) {



        AgentResponse response =
                agentService.getAgentById(id);



        return ResponseEntity.ok(

                ApiResponse.<AgentResponse>builder()

                .success(true)

                .message(
                        "Agent fetched successfully"
                )

                .data(response)

                .build()

        );

    }








    /*
     * Get All Active Agents
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AgentResponse>>> getAllAgents() {



        List<AgentResponse> response =
                agentService.getAllAgents();



        return ResponseEntity.ok(

                ApiResponse.<List<AgentResponse>>builder()

                .success(true)

                .message(
                        "Agents fetched successfully"
                )

                .data(response)

                .build()

        );

    }







    /*
     * Get Agent By User Id
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<AgentResponse>> getAgentByUserId(
            @PathVariable String userId) {



        AgentResponse response =
                agentService.getAgentByUserId(userId);



        return ResponseEntity.ok(

                ApiResponse.<AgentResponse>builder()

                .success(true)

                .message(
                        "Agent fetched successfully"
                )

                .data(response)

                .build()

        );

    }








    /*
     * Update Agent
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AgentResponse>> updateAgent(
            @PathVariable String id,
            @Valid @RequestBody AgentRequest request) {



        AgentResponse response =
                agentService.updateAgent(
                        id,
                        request
                );



        return ResponseEntity.ok(

                ApiResponse.<AgentResponse>builder()

                .success(true)

                .message(
                        "Agent updated successfully"
                )

                .data(response)

                .build()

        );

    }








    /*
     * Approve Agent
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<AgentResponse>> approveAgent(
            @PathVariable String id) {



        AgentResponse response =
                agentService.approveAgent(id);



        return ResponseEntity.ok(

                ApiResponse.<AgentResponse>builder()

                .success(true)

                .message(
                        "Agent approved successfully"
                )

                .data(response)

                .build()

        );

    }









    /*
     * Reject Agent
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<AgentResponse>> rejectAgent(
            @PathVariable String id) {



        AgentResponse response =
                agentService.rejectAgent(id);



        return ResponseEntity.ok(

                ApiResponse.<AgentResponse>builder()

                .success(true)

                .message(
                        "Agent rejected successfully"
                )

                .data(response)

                .build()

        );

    }









    /*
     * Delete Agent
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAgent(
            @PathVariable String id) {



        agentService.deleteAgent(id);



        return ResponseEntity.ok(

                ApiResponse.<Void>builder()

                .success(true)

                .message(
                        "Agent deleted successfully"
                )

                .build()

        );

    }


}