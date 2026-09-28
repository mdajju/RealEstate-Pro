\# RealEstate Pro



Enterprise Real Estate Management Platform



\## Overview



RealEstate Pro is a full-stack real estate management platform

developed using Java, Spring Boot, MongoDB and React.js.



The platform provides separate role-based workflows for:



\- Super Admin

\- Admin

\- Owner

\- Customer



\## Technology Stack



\### Backend

\- Java 21

\- Spring Boot

\- Spring Security

\- JWT Authentication

\- Spring Data MongoDB

\- MongoDB

\- Maven

\- REST APIs

\- Bean Validation

\- Global Exception Handling

\- Swagger / OpenAPI

\- Lombok

\- MapStruct



\### Frontend

\- React.js 19

\- React Router

\- Redux Toolkit

\- Material UI

\- Axios

\- Formik

\- Yup

\- React Hook Form

\- TanStack Query

\- Chart.js

\- Framer Motion



\## Main Features



\### Authentication \& Authorization

\- User registration and login

\- JWT-based authentication

\- Role-based access control

\- Protected routes

\- Admin, Owner and Customer workflows



\### Admin Module

\- Admin dashboard

\- User management

\- Property management

\- Property type management

\- State and city management

\- Booking management

\- Payment management

\- Complaint management

\- Notification management



\### Owner Module

\- Owner dashboard

\- Property management

\- Create and edit properties

\- Property details

\- Booking management

\- Customer inquiries

\- Payments

\- Complaints

\- Notifications

\- Reviews

\- Owner profile



\### Customer Module

\- Customer dashboard

\- Browse properties

\- Search and filter properties

\- Property details

\- Property booking

\- Booking management

\- Payments

\- Favourites

\- Reviews

\- Notifications

\- Complaints

\- Customer profile



\### Property Management

\- Property CRUD operations

\- Property types

\- Property status management

\- Property images

\- Location information

\- Price and property details



\### Booking Management

\- Property visit booking

\- Booking status management

\- Accept/reject booking

\- Booking completion

\- Booking cancellation

\- Notifications for booking events



\### Payment Management

\- Payment creation

\- Payment tracking

\- Multiple payment methods

\- Payment status management



\### Notification System

\- User notifications

\- Booking notifications

\- Payment notifications

\- Read/unread notification status



\### Reviews \& Favourites

\- Property reviews

\- Rating system

\- Favourite properties

\- Review management



\### Complaint Management

\- Customer complaints

\- Complaint status tracking

\- Admin/owner complaint handling

\- Remarks and resolution workflow



\## Project Architecture



RealEstate Pro follows a full-stack architecture:



React Frontend

&#x20;       ↓

REST APIs

&#x20;       ↓

Spring Boot Backend

&#x20;       ↓

Spring Security / JWT

&#x20;       ↓

MongoDB



\## Project Structure



RealEstate-Pro/

│

├── backend/

├── frontend/

├── database/

├── docker/

├── docs/

├── aws/

├── postman/

├── src/

├── pom.xml

└── README.md



\## Running the Project



\### Backend



Start the Spring Boot application.



Backend:



http://localhost:9090



\### Frontend



Navigate to the frontend directory:



cd frontend



Install dependencies:



npm install



Start the development server:



npm run dev



Frontend:



http://localhost:5173



\## Database



MongoDB is used as the primary database.



Database:



realestate\_pro\_db



\## Security



The application implements:



\- JWT authentication

\- Role-based authorization

\- Protected API endpoints

\- Protected frontend routes

\- Password-based authentication

\- Spring Security



\## Future Deployment



The project is designed with future cloud deployment in mind.



Planned infrastructure includes:



\- AWS EC2

\- AWS S3

\- CloudFront

\- Route 53

\- Nginx

\- SSL

\- CloudWatch



\## Author



Mohammed Rajju



GitHub:

mdajju



\## Project Status



The core Admin, Owner and Customer workflows are implemented

and tested locally.

