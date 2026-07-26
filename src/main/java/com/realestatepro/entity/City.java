package com.realestatepro.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cities")
public class City {


    @Id
    private String id;


    private String cityName;


    /*
     * State Reference
     */
    private String stateId;


    /*
     * Soft Delete
     */
    @Builder.Default
    private Boolean active = true;


    /*
     * Audit Fields
     */
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();


    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

}