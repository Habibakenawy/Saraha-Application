# Saraha Application

A secure, anonymous messaging platform built using the MERN stack (Node.js, Express, MongoDB). The application focuses on building a hidden-sender environment where receivers can securely read messages and reply to them if the sender holds an authenticated account on the platform.

---

## 🚀 Core Features & Specifications

### 1. User Management
* **Profile Attributes:** First name, Last name, Email, Password, Phone, Gender (`male`, `female`), Cover picture array, Address.
* **Authentication Providers:** Support for traditional credential registration (`system`) and external Google OAuth (`Signup-google`).
* **Security Tracking:** Monitors `change Credential time` to actively invalidate active sessions or tokens upon security alterations.

### 2. Messaging Engine
* **Rich Payloads:** Supports multi-modal content types containing text body, images, and embedded emojis.
* **Data Model:** Strict schema binding matching explicit `destination Id` targets while keeping track of optional `sender Id` references to support secure reply paths.

---

## 🛠️ System Capabilities

### Functional Requirements
* **User System:** `Signup` | `Login` | `Forgot password` | `Profile View` | `Update Profile` | `Update Password`
* **Message System:** `Create` | `Get` | `Soft Delete` (flags messages as inactive instead of hard-dropping from database)

### Non-Functional Requirements
* **Security:** * Password hashing algorithms (`hash`)
  * Data transport payload protection (`encryption`)
  * Validated signup lifecycles (`Email verification`)
  * Strict schema layer data integrity (`Validation`)
* **Infrastructure Metrics:** Optimized for horizontal `Scalability`, low latency `Performance`, and high operational `Availability`.

---

## 📅 Agile Development Roadmap

### 🏁 Sprint 1 (`02/04/2026 – 08/02/2026`)
- [x] Formulate Software Development Life Cycle (**SDLC**) workflows.
- [x] Configure production-ready standard **Folder Structure**.
- [x] Set up robust **Database Connection** configurations and repository patterns.
- [x] Implement initial user registration via **Signup / Login**.
- [x] Implement secure cryptographic **Hashing** and payload **Encryption** libraries.

### 🏃 Sprint 2 (`11/02/2026 – 15/02/2026`)
- [x] Implement user **Profile** viewing and mutation systems.
- [x] Build stateless session handling via securely signed JSON Web **Tokens**.
- [x] Mount modular **Authentication** and **Authorization** middleware guards.
- [x] Establish strict request body schema **Validation**.
- [x] Integrate background automated mail dispatch services (**Send Email**).

### 🚀 Sprint 3 (`18/02/2026 – 22/02/2026`)
- [ ] Connect external federation services via **Google account** integration.
- [ ] Implement cloud storage attachment architectures (**File upload**).
- [ ] Build role-based access management structures (**Administration level**).
- [ ] Deploy production environments onto scalable cloud infrastructure (**Deployment AWS EC2**).
