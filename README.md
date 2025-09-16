# Kredi - Decentralized Lending Platform 🚀

A revolutionary DeFi lending platform built on the Stellar network, enabling secure, transparent, and efficient peer-to-peer lending with on-chain credit scoring.

## 🎥 Demo Video

**Hackathon Demo**: [Watch the full demo video](https://drive.google.com/drive/u/5/folders/14TG2EyDwDqfzJWhL075GO2Ujz53hAb_p)

## 🌟 Features

- **On-Chain Credit Scoring**: Dynamic credit assessment based on blockchain transaction history
- **Stellar Network Integration**: Built on Stellar for fast, low-cost transactions
- **Transparent Lending**: Clear fee structure with $2 processing fee and 20% collateral
- **Real-Time Analytics**: Live credit score updates and loan history tracking
- **Mobile-First Design**: Beautiful, intuitive React Native interface
- **Secure Wallet Connection**: Direct integration with Stellar wallets

## 🏗️ Architecture

This is an [Expo](https://expo.dev) project with a Node.js backend, featuring:

- **Frontend**: React Native with Expo Router for navigation
- **Backend**: Node.js with Express and MongoDB Atlas
- **Blockchain**: Stellar Network integration
- **Database**: MongoDB for loan data and user profiles
- **Authentication**: JWT-based secure authentication

## 💰 Lending Model

- **Maximum Loan**: $100 per application
- **Processing Fee**: Static $2 fee (Kredi's revenue)
- **Collateral**: 20% frozen as security (returned on repayment)
- **No Interest**: Simple, transparent fee structure
- **Quick Processing**: Instant approval for qualified users

## 🎯 How It Works

1. **Connect Wallet**: Link your Stellar wallet to the platform
2. **Credit Analysis**: Optional on-chain data analysis for better rates
3. **Apply for Loan**: Request up to $100 with clear terms
4. **Instant Funding**: Receive funds immediately (minus $2 fee)
5. **Flexible Repayment**: Pay back within your chosen timeframe
6. **Collateral Return**: Get your 20% collateral back upon repayment

## 🚀 Get Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ 
- Expo CLI
- MongoDB Atlas account
- Stellar testnet account

### Backend Setup
1. Navigate to `kredi-be-node` directory
2. Install dependencies: `npm install`
3. Configure MongoDB Atlas connection
4. Start server: `npm start` (runs on port 3000)

### Frontend Setup
1. Stay in `kredi-mobile` directory  
2. Install dependencies: `npm install`
3. Start Expo: `npx expo start`
4. Use Expo Go app or simulator to test

## 🌐 API Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/loans` - Fetch user loans
- `POST /api/v1/loans` - Create new loan application

## 📱 Supported Platforms

- ✅ iOS (iPhone/iPad)
- ✅ Android (Phone/Tablet)
- ✅ Web (Progressive Web App)

## 🏆 Hackathon Project

This project was developed for the Stellar blockchain hackathon, showcasing innovative DeFi lending solutions with real-world utility and beautiful user experience.

## 📄 License

Built with ❤️ for the decentralized future of finance.
