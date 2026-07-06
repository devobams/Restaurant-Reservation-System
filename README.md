# Restaurant Reservation System
A Backend REST API for managing restaurant reservations.

## Team
TechCrush C7 Group 10 Team

## Project Status
Currently under active development.

## Table of Contents
- Introduction
- Features 
- Tech Stack 
- Project structure
- Installation
- Environment variables
- Running the project 
- API endpoints 
- Example request and response
- Testing
- Contributors
- Licence

## Introduction
This Restaurant Reservation API is a RESTful backend application designed to help restaurants manage customer reservations efficiently. It enabes users to create, view, update and cancel reservations while ensuring reservatio data is properly validated and stored. 

## Features
- Create reservations
- View all reservation
- View a reservation by ID 
- Update reservation details 
- Cancel reservation
- Validate user input
- Handle errors properly 

## Tech Stack
- **Runtime Environment:** Node.js

- **Framework:** Express.js

- **Development Tool:** Nodemon

## Project Structure
```text
restaurant-reservation-system/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── validators/
│
├── app.js
├── index.js
├── package.json
├── package-lock.json
└── README.md
```
### Folder Description

- **config/** – Stores application configuration files.
- **controllers/** – Contains the business logic for handling requests and responses.
- **data/** – Stores seed data or project data files.
- **middleware/** – Contains middleware functions used during request processing.
- **models/** – Defines the application's data models.
- **routes/** – Defines the API endpoints.
- **services/** – Contains reusable business logic used by controllers.
- **utils/** – Contains helper or utility functions.
- **validators/** – Contains request validation logic.

## Installation

1. Clone the repository

```bash
git clone <repository-url>
```

2. Navigate to the project folder

```bash
cd restaurant-reservation-system
```

3. Install the project dependencies

```bash
npm install
```
