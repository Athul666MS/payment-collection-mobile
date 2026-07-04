# Payment Collection Frontend Application

## Project Overview
A premium, responsive, cross-platform frontend application for the Payment Collection System. Built using Expo and React Native Web, it allows customers to look up their loan details, make EMI payments securely, and view their transaction history. The UI is designed to simulate a modern, award-winning fintech SaaS application.

**Production URL**: http://pay-app.duckdns.org
**Repository**: https://github.com/Athul666MS/payment-collection-mobile.git

## Features
- **Cross-Platform**: Runs natively on iOS/Android via Expo Go, and runs on the web via React Native Web.
- **Premium Fintech Design**: State-of-the-art UI with hover states, micro-interactions, and a cohesive design system.
- **Dynamic Payment Status**: Visually tracks whether the current month's EMI is paid or pending.
- **Seamless Navigation**: Type-safe routing using React Navigation.
- **Centralized API Integration**: Uses Axios with interceptors for robust error handling.

## Technology Stack
- **Framework**: React Native (Expo SDK)
- **Language**: TypeScript
- **Web Export**: Expo Web (`npx expo export -p web`)
- **Navigation**: React Navigation
- **Networking**: Axios
- **Icons**: Expo Vector Icons (Feather)

## Folder Structure
```text
frontend/
├── assets/           # Images, fonts, and splash screens
├── src/
│   ├── api/          # Axios client and API endpoints
│   ├── components/   # Reusable UI components
│   │   ├── common/   # Button, Card, Input, Loader
│   │   └── feedback/ # EmptyState, ErrorState
│   ├── constants/    # Theme colors and API config
│   ├── navigation/   # Stack navigators and route types
│   ├── screens/      # Main application views (Home, Payment, History, etc.)
│   ├── types/        # TypeScript interfaces and models
│   └── utils/        # Helper functions (currency formatters, date formatters)
├── App.tsx           # Application entry point
├── app.json          # Expo configuration
└── .env              # Environment variables
```

## Screen Overview
1. **Home Screen**: Landing page to look up an account by Account Number. Features quick action cards.
2. **Loan Details Screen**: Displays total loan, EMI due, remaining balance, and current EMI status (Paid/Pending).
3. **Payment Screen**: Secure form to submit an EMI payment. Validates amount against remaining balance.
4. **Payment Success Screen**: Digital receipt confirming the transaction ID and amount paid.
5. **Payment History Screen**: Chronological list of all past successful payments.

## Navigation Flow
`Home` -> `Loan Details` -> `Payment` -> `Payment Success`
Quick Actions allow jumping directly to `Payment` or `History`.

## API Integration
All API requests flow through `src/api/axiosClient.ts`, which includes response interceptors to catch network timeouts or server errors and surface them cleanly to the user.

## Environment Variables
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_API_BASE_URL=http://pay-app.duckdns.org/api
```

## Local Development Setup
```bash
npm install
npm run start
```
Use `w` to open in web browser, or scan the QR code with Expo Go.

## Expo Commands
- `npx expo start -c` (Clear cache and start)
- `npx expo start --tunnel` (Bypass local network restrictions)

## Build Commands
To generate the static web bundle for production:
```bash
npx expo export -p web
```
This generates a `dist/` directory containing the `index.html` and static JS/CSS assets.

## Deployment Steps
The frontend web bundle is deployed automatically via GitHub Actions to an AWS EC2 instance where Nginx serves the `dist/` folder.
See `.github/workflows/deploy.yml` for the SCP/SSH deployment pipeline.

## Troubleshooting
- **Network Error (Expo Go)**: Ensure your phone and development computer are on the same Wi-Fi network, and your `.env` IP matches your computer's local IP address.
- **Missing Environment Variables**: Expo requires the `EXPO_PUBLIC_` prefix. Ensure you restart the Metro bundler with `-c` when changing `.env`.
