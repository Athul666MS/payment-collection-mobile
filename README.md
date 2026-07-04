# Payment Collection Application (Frontend)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=flat&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)

A modern, highly responsive, cross-platform mobile and web application built to streamline the loan EMI payment process for customers. This repository contains the **Frontend** application, built using Expo (React Native).

## 🚀 Live Demo
- **Web App**: [http://pay-app.duckdns.org](http://pay-app.duckdns.org)
- **API Base URL**: `http://pay-app.duckdns.org/api`

## 📑 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Local Setup Instructions](#local-setup-instructions)
5. [Environment Configuration](#environment-configuration)
6. [Architecture & Folder Structure](#architecture--folder-structure)
7. [Deployment (CI/CD)](#deployment-cicd)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview
This application provides customers with a seamless, premium interface to:
- Look up their loan account details using an alphanumeric account number (e.g., `ACC1001`).
- View their **Total Loan Amount**, **Remaining Balance**, and **Monthly EMI Amount**.
- Track whether the current month's EMI is **Paid** or **Pending**.
- Make secure, validated EMI payments directly from the app.
- View a chronological history of all past transactions with unique receipt IDs.

---

## ✨ Key Features
- **Cross-Platform Compatibility**: A single codebase compiles to native iOS, native Android, and a fully responsive Web Application using React Native Web.
- **Premium Design System**: Custom-built styling utilizing modern micro-interactions, responsive typography, and cohesive color palettes (without relying on heavy third-party UI libraries).
- **Robust State Management**: Leverages React Hooks and Context to maintain clean and predictable data flow.
- **Centralized API Networking**: Utilizes Axios with interceptors for global error handling, timeout configurations, and clean payload processing.
- **Strict Validation**: Input sanitization and client-side validation to prevent overpayments or invalid data submissions.

---

## 🛠 Technology Stack
| Category | Technology |
|---|---|
| **Framework** | React Native (via Expo SDK) |
| **Language** | TypeScript |
| **Routing/Navigation**| React Navigation |
| **Networking** | Axios |
| **Icons** | Expo Vector Icons (Feather) |

---

## 💻 Local Setup Instructions

Follow these steps to run the application on your local machine:

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo Go app installed on your physical mobile device (optional, for mobile testing)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Athul666MS/payment-collection-mobile.git
   cd payment-collection-mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start -c
   ```

4. **View the app:**
   - **Web**: Press `w` in the terminal to open the web version in your browser.
   - **Mobile**: Open the Expo Go app on your phone and scan the QR code in the terminal.

---

## ⚙️ Environment Configuration

For the app to connect to the backend API, you must configure the environment variables.

1. Create a `.env` file in the root of the project.
2. Add the following variable, pointing to either your local backend or the production server:

```env
# For local development (replace with your machine's IP address if testing on physical mobile device)
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api

# For production
# EXPO_PUBLIC_API_BASE_URL=http://pay-app.duckdns.org/api
```
*Note: Any environment variable meant to be accessed by the client app MUST begin with `EXPO_PUBLIC_`.*

---

## 📂 Architecture & Folder Structure

```text
frontend/
├── assets/             # Static assets (images, fonts, splash screens)
├── src/
│   ├── api/            # API integration (Axios client, endpoints)
│   ├── components/     # Reusable, atomic UI components
│   │   ├── common/     # Buttons, Cards, Inputs, Loading indicators
│   │   └── feedback/   # Error states, Empty states
│   ├── constants/      # App-wide constants (Colors, Typography, API config)
│   ├── navigation/     # React Navigation stacks and type definitions
│   ├── screens/        # Main application views
│   │   ├── HomeScreen.tsx
│   │   ├── LoanDetailsScreen.tsx
│   │   ├── PaymentScreen.tsx
│   │   ├── PaymentSuccessScreen.tsx
│   │   └── PaymentHistoryScreen.tsx
│   ├── types/          # TypeScript interfaces (Models, API Responses)
│   └── utils/          # Helper functions (currency and date formatters)
├── App.tsx             # Root component and Navigation Container
└── app.json            # Expo configuration manifest
```

---

## 🚀 Deployment (CI/CD)

The frontend is deployed as a static web application to an AWS EC2 instance. The entire deployment process is fully automated using **GitHub Actions**.

### Build Process
The application is exported to a static bundle using:
```bash
npx expo export -p web
```
This generates a highly optimized `dist/` folder containing the compiled `index.html`, JavaScript, and CSS.

### CI/CD Pipeline (`.github/workflows/deploy.yml`)
On every push to the `main` branch:
1. **GitHub Actions** checks out the code and installs Node.js.
2. The web bundle is built using the command above.
3. Using `appleboy/scp-action`, the `dist/` directory is securely copied to the EC2 server over SSH.
4. Using `appleboy/ssh-action`, the files are synced via `sudo rsync` into the public web root (`/var/www/payment-collection-frontend`).
5. **Nginx** serves these files over port 80.

---

## 🔧 Troubleshooting

- **Network Error (Expo Go)**: If you see a Network Error on your phone, ensure your phone and computer are on the exact same Wi-Fi network. Also, verify that your `.env` file uses your computer's local IP address (e.g., `192.168.1.10`), NOT `localhost`.
- **Environment Variables Not Loading**: If you change the `.env` file while the server is running, you must restart the Metro bundler with the clear-cache flag: `npx expo start -c`.
- **Metro Bundler Port Conflicts**: If port 8081 is in use, Expo will try to use another port. You can force a port using `npx expo start --port 19000`.
