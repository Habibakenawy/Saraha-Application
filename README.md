# Saraha Application

A secure, anonymous messaging platform built using the MERN stack (Node.js, Express, MongoDB). The application focuses on building a hidden-sender environment where receivers can securely read messages and reply to them if the sender holds an authenticated account on the platform.

---

## 🛠️ Tech Stack & Environment Architecture

* **Runtime Environment:** Node.js
* **Database Object Modeling:** Mongoose / MongoDB
* **Environment Management:** `dotenv` (supporting multi-stage environments)

The repository comes pre-configured with distinct operational environments managed inside the `src/config/` directory:

* `.env.development` — Tailored for local sandboxed execution pipelines.
* `.env.production` — Tailored for stable deployment releases.

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Installation

Clone the repository, navigate to the root directory, and install the required dependencies:

```bash
npm i

```

### 3. Execution

To spin up the development server with live-reloading enabled via the application bootstrap entry point (`src/main.js`), run:

```bash
npm run start:dev

```

---

## 📁 Workspace Directory Structure

Based on the core system architecture, the codebase follows a modular design pattern:

```text
SARAHA APPLICATION
├── config/
│   ├── .env.development       # Local environment configurations
│   ├── .env.production        # Production environment configurations
│   └── config.service.js      # Central environment parsing engine
├── src/
│   ├── common/                # Shared utilities, helpers, and global constants
│   ├── DB/
│   │   ├── model/             # Mongoose database collections & schemas
│   │   └── connection.db.js   # Database initialization and connection logic
│   ├── modules/
│   │   ├── auth/              # Registration, Login, and Identity management
│   │   └── user/              # User profile operations and mutations
│   ├── index.js               # Application router aggregation
│   ├── app.bootstrap.js       # Core Server and Express initialization
│   └── main.js                # Primary execution entry point
├── .gitattributes
├── .gitignore
├── package.json
└── package-lock.json

```

---

## 🔒 Core Specifications & Capabilities

### Functional Requirements

* **User System:** `Signup` | `Login` | `Forgot password` | `Profile View` | `Update Profile` | `Update Password`
* **Message System:** `Create` | `Get` | `Soft Delete` (flags messages as inactive instead of hard-dropping from database)

### Non-Functional Requirements

* **Security Core:** * Password hashing algorithms (`hash`) with dynamic configuration configurations (e.g., `SALT_ROUND: 12`).
* Data transport payload protection (`encryption`).
* Validated signup lifecycles (`Email verification`).
* Strict schema layer data integrity (`Validation`).


* **Infrastructure Metrics:** Optimized for horizontal `Scalability`, low latency `Performance`, and high operational `Availability`.

---

## 📅 Agile Development Roadmap

### 🏁 Sprint 1 (`02/04/2026 – 08/02/2026`)

* [x] Formulate Software Development Life Cycle (**SDLC**) workflows.
* [x] Configure production-ready standard **Folder Structure**.
* [x] Set up robust **Database Connection** configurations using Mongoose.
* [x] Implement initial user registration via **Signup / Login**.
* [x] Implement secure cryptographic **Hashing** and payload **Encryption** libraries.

### 🏃 Sprint 2 (`11/02/2026 – 15/02/2026`)

* [x] Implement user **Profile** viewing and mutation systems.
* [x] Build stateless session handling via securely signed JSON Web **Tokens**.
* [x] Mount modular **Authentication** and **Authorization** middleware guards.
* [x] Establish strict request body schema **Validation**.
* [x] Integrate background automated mail dispatch services (**Send Email**).

### 🚀 Sprint 3 (`18/02/2026 – 22/02/2026`)

* [ ] Connect external federation services via **Google account** integration.
* [ ] Implement cloud storage attachment architectures (**File upload**).
* [ ] Build role-based access management structures (**Administration level**).
* [ ] Deploy production environments onto scalable cloud infrastructure (**Deployment AWS EC2**).
