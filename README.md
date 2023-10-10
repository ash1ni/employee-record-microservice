# Employee Data Summary Micro-Service

This Node.js micro-service provides functionality to manage and analyze employee data. It allows users to add, delete records and fetch summary statistics for salary in various ways. User registration and authentication are also implemented.

## Table of Contents

- [Employee Data Summary Micro-Service](#employee-data-summary-micro-service)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [Usage](#usage)
  - [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Error Handling](#error-handling)
  - [Run Test](#run-test)

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- A database system (e.g., MongoDB) for more efficient data storage and retrieval (optional).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ash1ni/employee-data-microservice.git
   cd employee-data-microservice

2. Install Dependencies:
   ```bash
   npm install

3. Start the server
   ```bash
   node app.js

# Usage

## API Endpoints

The following API endpoints are available:

| Method | Endpoint                     | Description               |
| ------ | ---------------------------- | ------------------------- |
| POST    | /add-record              | Add new record(Requires authentication)        |
| GET   | /get-all-records                   | Get all records(Requires authentication)     |
| DELETE    | delete-record/:recordId               | Delete an employee record by ID. (Requires authentication) |
| GET | /summary-salary              |  Get summary statistics for salary across the entire dataset. (Requires authentication)  |
| GET    | /on-contract               | Get summary statistics for salary for records with "on_contract": "true". (Requires authentication)      |
| GET    | /by-department                  | Get summary statistics for salary by department. (Requires authentication)      |
| GET    | /subdepartment-summary                 | Get summary statistics for salary by department and sub-department combination. (Requires authentication)      |

## Authentication

Authentication is required to access any endpoint that requires it, such as adding a new record or getting all records from the DB. To authenticate with this application
This micro-service uses Passport.js for user authentication with a local strategy. You can customize the authentication method according to your requirements. To access protected endpoints, you must register and log in as a user.

## Error Handling

Proper error handling is implemented for various scenarios, such as authentication failures, record not found, and other potential errors. Ensure to customize error messages and handling based on your needs.

## Run Test

```bash
npm test
