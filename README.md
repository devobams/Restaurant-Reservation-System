# Restaurant Reservation System

A backend REST API for managing restaurant reservations — built by a team as part of the **TechCrush Cohort 7, Group 10** collaborative project.

## Team
TechCrush C7 Group 10

## Project Status
Core CRUD functionality complete. Built collaboratively across sub-teams, each owning a distinct part of the request lifecycle (routing, validation, business logic, persistence).

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [How a Request Flows Through the System](#how-a-request-flows-through-the-system)
- [Business Rules](#business-rules)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Example Requests & Responses](#example-requests--responses)
- [Testing](#testing)
- [Possible Future Enhancements](#possible-future-enhancements)
- [Contributors](#contributors)
- [License](#license)

## Introduction
This Restaurant Reservation API is a RESTful backend application designed to help restaurants manage customer reservations efficiently. It allows customers to create, view, update, and cancel reservations, while the system handles input validation, table assignment, and conflict detection automatically — so no two reservations can ever be double-booked into the same table at overlapping times.

## Features
- **Create a reservation** — customers submit their details and party size; the system assigns an available table automatically.
- **View all reservations**
- **View a single reservation** by its ID
- **Update reservation details** (date, time, guest count, etc.)
- **Cancel a reservation** — implemented as a soft delete; cancelled reservations are marked `CANCELLED` and kept for record-keeping rather than deleted outright.
- **Automatic table assignment** — customers don't pick a table number themselves; the system finds the next available one.
- **Meal-duration conflict checking** — each reservation blocks its table for a fixed window (default: 1 hour) so no table is double-booked mid-meal.
- **Duplicate booking prevention** — a customer can't hold two overlapping confirmed reservations on the same day.
- **Smart "fully booked" response** — if no table is available at the requested time, the API suggests the next realistic open slot instead of a flat rejection.
- **Thorough input validation** — required fields, correct data types, valid Nigerian phone number format, valid date/time formats, no past dates or times, guest count within an allowed range.
- **Centralized error handling** with consistent status codes and messages.

> **Bonus feature implemented:** availability checking against total table capacity, including a suggested next available time slot when the requested one is full.

## Tech Stack
- **Runtime Environment:** Node.js
- **Framework:** Express.js (v5)
- **Module System:** ES Modules (`import`/`export`)
- **Data Persistence:** JSON file storage (`src/data/reservations.json`), read/written with the `fs/promises` API
- **Development Tool:** Nodemon

## How a Request Flows Through the System
Every request passes through the same layered structure, so responsibility stays clearly separated:

```
Client
  │
  ▼
Routes         → maps the URL + HTTP method to a controller function
  │
  ▼
Controller     → extracts request data, validates it, calls the service, returns the response
  │
  ▼
Validator      → checks the data is well-formed and makes business sense before anything is saved
  │
  ▼
Service        → business logic: duplicate checks, table assignment, availability, persistence
  │
  ▼
Model / data/reservations.json → the shape of a reservation and where it lives on disk
```

Validation runs at **two** points on purpose — once in the controller (fails fast on bad requests) and again in the service (protects the data file even if something calls the service directly, bypassing the controller).

## Business Rules
These are the actual rules the API enforces, beyond simple field checks:

- A reservation's `date` cannot be in the past; if the date is today, the `time` cannot be in the past either.
- `numberOfGuest` must be a whole number between 1 and 50.
- `phoneNumber` must match a valid Nigerian phone number format.
- `time` must be in 24-hour `HH:MM` format; `date` must be in `YYYY-MM-DD` format.
- Each reservation occupies its table for a fixed **meal duration** (default 60 minutes) from its start time. A new reservation can only be assigned a table whose meal window doesn't overlap with an existing **confirmed** reservation on that table.
- A customer (identified by phone number) cannot hold two **confirmed** reservations with overlapping time windows on the same date.
- If every table is booked for the requested window, the system checks upcoming hours (and the next day, if needed) and suggests the next realistic open slot in its error response.
- Cancelling a reservation is a **soft delete** — the record's `status` becomes `CANCELLED` and it's excluded from future conflict/duplicate checks, but it is never removed from storage.
- Every reservation is stamped with `createdAt` on creation and `updatedAt` on every subsequent change, for a basic audit trail.

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
- **config/** — App-wide configuration values: server port, total table capacity, meal duration window.
- **controllers/** — Receives requests, triggers validation, calls the appropriate service function, and shapes the HTTP response.
- **data/** — Where reservation records are persisted, as `reservations.json`.
- **middleware/** — Cross-cutting request handling, including centralized error handling (`AppError`).
- **models/** — Defines the shape of a `Reservation` object.
- **routes/** — Maps each `/api/reservations` endpoint to its controller function.
- **services/** — All business logic: validation orchestration, duplicate checks, table assignment, availability suggestions, and reading/writing the data file.
- **utils/** — Small, reusable helpers: ID generation, table-availability lookup, time conversions, next-slot suggestions.
- **validators/** — Input validation rules, checked independently of Express (`req`/`res` never appear here).

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

## Configuration
App-wide settings currently live in `src/config/app.config.js`:

| Setting | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | Port the server listens on |
| `TOTAL_TABLES` | `50` | Total number of tables the restaurant has available |
| `MEAL_DURATION_MINUTES` | `60` | How long a reservation occupies its table before it's free again |

To change any of these, edit the values directly in `app.config.js`. A `.env.example` file is included in the repo as a template for moving these to environment variables in the future.

## Running the Project

Start the server normally:
```bash
npm start
```

Start the server with auto-restart on file changes (recommended during development):
```bash
npm run dev
```

Once running, the API is available at:
```
http://localhost:3000
```

## API Endpoints

All reservation endpoints are prefixed with `/api/reservations`.

| Method | Endpoint | Description | Success | Possible Errors |
|---|---|---|---|---|
| GET | `/` | Health check — confirms the API is running | `200` | — |
| POST | `/api/reservations` | Create a new reservation; system assigns an available table automatically | `201` | `400` invalid input · `409` no table available or duplicate booking |
| GET | `/api/reservations` | Retrieve all reservations | `200` | — |
| GET | `/api/reservations/:id` | Retrieve a single reservation by ID | `200` | `404` not found |
| PUT | `/api/reservations/:id` | Update an existing reservation's details | `200` | `400` invalid input · `404` not found |
| DELETE | `/api/reservations/:id` | Cancel a reservation (soft delete — sets status to `CANCELLED`) | `200` | `404` not found |

## Example Requests & Responses

### Create a reservation
**Request**
```
POST /api/reservations
Content-Type: application/json
```
```json
{
  "fullName": "Ada Obi",
  "phoneNumber": "08012345678",
  "date": "2026-07-10",
  "time": "18:30",
  "numberOfGuest": 4
}
```

**Success response — `201 Created`**
```json
{
  "reservationId": "a1b2c3d4",
  "fullName": "Ada Obi",
  "phoneNumber": "08012345678",
  "date": "2026-07-10",
  "time": "18:30",
  "numberOfGuest": 4,
  "tableNumber": 7,
  "status": "CONFIRMED",
  "createdAt": "2026-07-05T09:12:00.000Z",
  "updatedAt": "2026-07-05T09:12:00.000Z"
}
```

**Fully booked response — `409 Conflict`**
```json
{
  "error": "No tables available at 2026-07-10 18:30. Next available: 2026-07-10 at 19:30"
}
```

**Validation error response — `400 Bad Request`**
```json
{
  "error": "numberOfGuest must be a number between 1 and 50"
}
```

## Testing
- Manual testing was carried out for every endpoint using Postman, covering both valid requests and key edge cases (past dates, invalid phone numbers, over-capacity bookings, cancelling a non-existent reservation).
- A Postman collection is included in the repository for anyone to import and re-run.

## Possible Future Enhancements
A few ideas that were discussed but sit outside this submission's scope:
- Pagination and date-based filtering on `GET /api/reservations`
- Moving configuration values (`PORT`, `TOTAL_TABLES`, etc.) into environment variables via `.env`
- A staff-facing review/approval workflow, if the reservation model ever needs a "pending" state
- Automated test suite (Jest/Supertest) alongside the existing manual Postman testing

## Contributors

TechCrush C7 Group 10:

- [@DevObams](https://github.com/DevObams)
- [@Dev-Jayjaw](https://github.com/Dev-Jayjaw)
- [@osiebejudith2022-eng](https://github.com/osiebejudith2022-eng)
- [@ojekab4u](https://github.com/ojekab4u)
- [@okuo-john](https://github.com/okuo-john)
- [@JohnPro300](https://github.com/JohnPro300)
- [@kamolilukeman-hash](https://github.com/kamolilukeman-hash)
- [@davekoya14-star](https://github.com/davekoya14-star)
- [@mariamafolabi50-lab](https://github.com/mariamafolabi50-lab)

For a detailed breakdown of individual contributions, see the repository's [Contributors graph](https://github.com/devobams/Restaurant-Reservation-System/graphs/contributors?from=4%2F4%2F2026).

## License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details, or adjust as your team/course requires.