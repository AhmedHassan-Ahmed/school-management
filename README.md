# School Management System API

A backend starter project for a School Management System built with **Node.js, Express.js, TypeScript, MongoDB, and Mongoose**.

This repository provides the initial project structure, Mongoose models, TypeScript interfaces, and database connection setup. It is designed to serve as a foundation for future development.

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — Web application framework
- **TypeScript** — Static typing
- **MongoDB** — NoSQL database
- **Mongoose** — MongoDB object modeling
- **dotenv** — Environment variable management

## Project Structure

```text
src/
├── config/
│   └── database.ts
├── modules/
│   ├── students/
│   │   ├── student.interface.ts
│   │   ├── student.model.ts
│   │   ├── student.controller.ts
│   │   ├── student.service.ts
│   │   └── student.routes.ts
│   ├── teachers/
│   ├── classes/
│   ├── subjects/
│   └── timetables/
├── app.ts
└── server.ts
```

Each module follows a feature-based structure, keeping models, interfaces, controllers, services, and routes organized separately.

## Current Status

### Implemented

- Initial Express.js server setup
- MongoDB connection using Mongoose
- Environment variable configuration
- TypeScript configuration
- Mongoose models and TypeScript interfaces for:
  - Students
  - Teachers
  - Classes
  - Subjects
  - Timetables
- Timestamps for created and updated records
- Unique index for student codes
- References between related models

### Planned

- Authentication and authorization
- CRUD operations for all modules
- Request validation
- Centralized error handling
- Search and pagination
- Timetable conflict validation


### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/school_management
```

Update `MONGODB_URI` if your MongoDB instance uses a different connection string.

### 4. Start the Development Server

```bash
npm run dev
```

The server will connect to MongoDB and listen on the configured port, `3000` by default.

### 5. Build the Project

```bash
npm run build
```

To run the compiled application:

```bash
npm start
```

## Data Models

| Model | Purpose |
|---|---|
| Student | Stores student information and class reference |
| Teacher | Stores teacher information |
| Class | Stores class name and grade level |
| Subject | Stores subject information |
| Timetable | Stores class, teacher, subject, day, and time references |

## Development Approach

The project uses a modular, feature-based architecture to keep the codebase organized and maintainable as new features are added.

The initial focus is on establishing the project foundation and data models before implementing business logic and API endpoints.

## License

No license has been specified yet.
