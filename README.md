# 🏥 DocDesk — Clinic & Hospital Practice Management SaaS Platform

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-teal.svg?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791.svg?logo=postgresql)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black.svg?logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **DocDesk** is an enterprise-grade **B2B Practice Management & Clinical Operations SaaS Platform** engineered for multi-specialty clinics, diagnostic centers, and outpatient hospital chains. Built to automate healthcare workflows from patient check-in to digital prescription dispensing and revenue billing.

---

## 🌟 Live Demo & Recruiter Access

- **Live Application:** [Deploying on Vercel](#deployment-guide)
- **Live API Endpoint:** [https://docdesk-lkqe.onrender.com/api/health](https://docdesk-lkqe.onrender.com/api/health)

### 🔑 Test Demo Credentials
| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Medical Director / Admin** | `admin@docdesk.demo` | `Demo@1234` | Full hospital access: Dashboard, Billing, Doctors, Patients, Rx, Analytics |
| **Attending Physician** | `doctor@docdesk.demo` | `Demo@1234` | Clinical workspace: Patient EHR, Appointments, Prescriptions, Medical Notes |

---

## 📐 System Architecture

```mermaid
graph TD
    A[Clients: Web Browser / Tablet] -->|HTTPS / REST| B[Vercel: React 18 SPA]
    B -->|Bearer JWT Authentication| C[Railway / Cloud: Express.js API Gateway]
    C -->|Prisma ORM Queries| D[(PostgreSQL: Supabase Database)]
    C -->|Multer / Secure Uploads| E[Cloudinary CDN: Clinical Documents & Scans]
    B -->|PDF Generation Engine| F[Print Invoices & QR Payment Receipt]
```

---

## ⚡ Core Feature Modules

### 1. 📊 Executive Command Center & Financial Analytics
- Real-time earnings summary across customizable date windows (Today, 7-day rolling, 30-day month).
- Revenue breakdown categorized by payment instrument (**Cash**, **Online / UPI**, **Cheque**).
- Patient acquisition and consultation metrics tracking.

### 2. 🧑‍🤝‍🧑 Patient EHR & Longitudinal Medical History
- Detailed demographic, contact, and emergency records.
- Service package subscriptions (seating allocation and balance consumption).
- Longitudinal appointment timeline with clinical diagnosis records.
- Document Vault for lab reports, pathology charts, and diagnostic imagery.

### 3. 📅 Multi-Specialist Appointment Engine
- Scheduling calendar with automated slot conflict prevention.
- Dynamic filtering by date range, provider specialty, and consultation status (`UPCOMING`, `COMPLETED`, `CANCELLED`).
- Clinical notes and preliminary diagnosis capture.

### 4. 💊 Digital Prescription (Rx) & Formulary
- Integrated formulary catalog (dosage, administration route, frequency, and duration).
- Master pharmaceutical database lookup.
- Direct association of prescriptions with appointment records.

### 5. 💳 Revenue Cycle & Automated Invoicing
- Itemized invoicing with automatic total and tax calculations.
- Unique transaction audit trails and payment status tracking.
- **Dynamic Print Invoice Generator** featuring clinic logo, patient demographics, line items, and dynamic **UPI Scan-to-Pay QR Code**.
- Exportable financial reports with Excel export capability.

### 6. 🔐 Fine-Grained Role-Based Access Control (CASL)
- Multi-tier RBAC powered by `@casl/ability` and JWT verification.
- Contextual permissions restricting doctors to clinical workflows and empowering administrators with financial and operational authority.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 18 (SPA)
- **Routing:** React Router DOM v6
- **UI System:** Bootstrap 5, Material Design Symbols, Material UI Date Pickers
- **Forms & Validation:** Formik + Yup
- **Authorization:** `@casl/ability` + `@casl/react`
- **Networking:** Axios with request/response interceptors & token refresh logic
- **Reporting:** XLSX Excel export, react-pdf-renderer, html2canvas, jsPDF

### Backend (Server)
- **Runtime:** Node.js v20 LTS
- **Framework:** Express.js
- **ORM:** Prisma Client & Migrations
- **Database:** PostgreSQL (Supabase / Railway / Neon compatible)
- **Security:** JWT (JSON Web Tokens), bcrypt password hashing, CORS protection
- **Media Storage:** Cloudinary SDK + Multer (with disk-storage local fallback)
- **Logging:** Morgan HTTP logger

---

## 📁 Repository Structure

```
DocDesk/
├── client/                     # React Frontend Application
│   ├── public/                 # Static assets, HTML shell & manifest
│   ├── src/
│   │   ├── apiServices/        # Axios instances & API service abstraction
│   │   ├── components/         # Layouts, Sidebar, Header, FileUploader, Guards
│   │   ├── context/            # AuthProvider & CASL Ability context
│   │   ├── views/              # Feature pages (Dashboard, Appointments, Patients, Billing)
│   │   ├── App.js              # Application router
│   │   └── constants.js        # Global API & environment constants
│   ├── vercel.json             # Vercel SPA routing rules
│   └── package.json
│
├── server/                     # Node.js / Express Backend
│   ├── prisma/
│   │   ├── schema.prisma       # Relational database schema
│   │   └── seed.js             # Comprehensive demo data seeder
│   ├── src/
│   │   ├── config/             # Prisma client & Cloudinary configurations
│   │   ├── controllers/        # Business logic for all 30+ endpoints
│   │   ├── middleware/         # JWT verification & RBAC middleware
│   │   ├── routes/             # RESTful API route definitions
│   │   └── index.js            # Express server initialization
│   ├── railway.json            # Railway deployment configuration
│   ├── .env.example            # Environment variables template
│   └── package.json
│
├── package.json                # Monorepo scripts orchestrator
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## 🚀 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/Shekhar1811/DocDesk.git
cd DocDesk
```

### 2. Configure Backend Environment
Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
JWT_SECRET="docdesk_jwt_secret_key_2026"
```

### 3. Setup Database & Seed
```bash
cd server
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### 4. Start the Application
In terminal 1 (Backend API):
```bash
npm run dev --prefix server
# Server running at http://localhost:5000
```

In terminal 2 (Frontend Client):
```bash
npm start --prefix client
# Client running at http://localhost:3000
```

---

## 🌐 Deployment Guide

### Deploy Backend (Railway / Render)
1. Link your GitHub repository `Shekhar1811/DocDesk` on [Railway](https://railway.app).
2. Set **Root Directory** to `server`.
3. Add Environment Variables:
   - `DATABASE_URL`: Your Supabase PostgreSQL URI
   - `JWT_SECRET`: A secure random string
4. Deploy! Your backend URL will be: `https://[your-railway-app].up.railway.app`

### Deploy Frontend (Vercel)
1. Import repository `Shekhar1811/DocDesk` on [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Framework Preset: **Create React App**.
4. Add Environment Variable:
   - `REACT_APP_API_URL`: `https://[your-railway-app].up.railway.app/`
5. Deploy!

---

## 📄 License
Distributed under the MIT License. Developed and maintained by [Shekhar Bhadre](https://github.com/Shekhar1811).
