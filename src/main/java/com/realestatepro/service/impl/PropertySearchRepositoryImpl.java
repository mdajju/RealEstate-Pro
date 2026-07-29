package com.realestatepro.service.impl;


import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.realestatepro.dto.request.PropertySearchRequest;
import com.realestatepro.entity.Property;
import com.realestatepro.repository.PropertySearchRepository;

import lombok.RequiredArgsConstructor;


@Repository
@RequiredArgsConstructor
public class PropertySearchRepositoryImpl implements PropertySearchRepository {


    private final MongoTemplate mongoTemplate;



    @Override
    public List<Property> searchProperties(PropertySearchRequest request) {


        Query query = new Query();


        /*
         * Always fetch active properties only
         */
        query.addCriteria(
                Criteria.where("active")
                        .is(true)
        );



        /*
         * City Filter
         */
        if (request.getCityId() != null &&
                !request.getCityId().isEmpty()) {

            query.addCriteria(
                    Criteria.where("cityId")
                            .is(request.getCityId())
            );
        }




        /*
         * State Filter
         */
        if (request.getStateId() != null &&
                !request.getStateId().isEmpty()) {

            query.addCriteria(
                    Criteria.where("stateId")
                            .is(request.getStateId())
            );
        }




        /*
         * Property Type Filter
         */
        if (request.getPropertyTypeId() != null &&
                !request.getPropertyTypeId().isEmpty()) {

            query.addCriteria(
                    Criteria.where("propertyTypeId")
                            .is(request.getPropertyTypeId())
            );
        }




        /*
         * Minimum Price
         */
        if (request.getMinPrice() != null) {

            query.addCriteria(
                    Criteria.where("price")
                            .gte(request.getMinPrice())
            );
        }





        /*
         * Maximum Price
         */
        if (request.getMaxPrice() != null) {

            query.addCriteria(
                    Criteria.where("price")
                            .lte(request.getMaxPrice())
            );
        }




        /*
         * Bedrooms Filter
         */
        if (request.getBedrooms() != null) {

            query.addCriteria(
                    Criteria.where("bedrooms")
                            .is(request.getBedrooms())
            );
        }





        /*
         * Bathrooms Filter
         */
        if (request.getBathrooms() != null) {

            query.addCriteria(
                    Criteria.where("bathrooms")
                            .is(request.getBathrooms())
            );
        }




        return mongoTemplate.find(
                query,
                Property.class
        );
    }

}