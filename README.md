# AxeDz Backend Service

# 1. Project Overview

## Introduction
AxeDz is a scalable backend platform developed using Node.js and Express.js.  
The system was designed as a modern service-oriented backend architecture capable of handling authentication, wallet management, payment processing, API key management, communication services, realtime notifications, and administrative operations.

The platform integrates multiple technologies such as PostgreSQL, RabbitMQ, Socket.io, AWS S3, and external payment gateways in order to provide a secure, scalable, and production-ready infrastructure.

The architecture follows modular software engineering principles and separates responsibilities between controllers, services, middlewares, workers, and infrastructure layers to improve maintainability, scalability, and reliability.

---

# 2. Project Objectives

The main objectives of the AxeDz platform are:

- Build a secure and scalable backend platform
- Implement JWT authentication with refresh token support
- Provide realtime wallet and payment updates
- Handle asynchronous processing using RabbitMQ workers
- Support API key lifecycle management
- Integrate cloud storage using AWS S3
- Implement secure payment workflows
- Design reusable and modular backend architecture
- Ensure system extensibility for future scaling

---

# 3. Main Technologies

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | HTTP server framework |
| PostgreSQL | Relational database |
| Sequelize ORM | Database ORM and migrations |
| RabbitMQ | Asynchronous message broker |
| Socket.io | Realtime communication |
| JWT | Authentication system |
| AWS S3 | Cloud file storage |
| Multer-S3 | File upload middleware |
| Nodemailer | Email service |
| SATIM SDK | Payment gateway integration |
| Docker | Containerization |
| Winston Logger | Logging and monitoring |

---

# 4. System Architecture
# Global System Architecture

## Main Components

The platform is composed of:

| Component | Responsibility |
|---|---|
| API Server | Request processing and business orchestration |
| PostgreSQL | Persistent relational data storage |
| RabbitMQ | Asynchronous communication broker |
| Email Worker | Email processing and delivery |
| SMS Worker | SMS processing and delivery |
| Socket.io Layer | Realtime communication |
| AWS S3 | Cloud file storage |
| SATIM Gateway | External payment processing |

---

# High-Level Workflow

```txt
Client Applications
(Web / Mobile / Admin Dashboard)
                │
                ▼
        API Gateway Layer
                │
                ▼
        Express Application
                │
     ┌──────────┼──────────┐
     │          │          │
     ▼          ▼          ▼
Authentication  Payments   Communication
Module          Module     Module
     │          │          │
     └──────────┼──────────┘
                │
                ▼
        Business Services Layer
                │
     ┌──────────┼──────────┐
     │          │          │
     ▼          ▼          ▼
 PostgreSQL   RabbitMQ    AWS S3
 Database      Broker     Storage
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
     Email Worker         SMS Worker
        │                     │
        ▼                     ▼
 Email Processing      SMS Processing
                │
                ▼
         Socket.io Events
                │
                ▼
        Realtime Client Updates