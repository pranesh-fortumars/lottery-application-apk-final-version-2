# 💎 SMS Lottery Secretariat Suite - Next-Gen Gaming Platform

An enterprise-grade, high-fidelity lottery management and play platform built for absolute speed, bank-grade security, and complete financial transparency. Engineered with a reactive Firebase NoSQL architecture and a premium glassmorphic UI, it provides a flawless end-to-end bridge between administrative result declarations, automated player payouts, and strict financial auditing.

---

## 🚀 Key Features

### 🎮 For Players
- **Triple-Balance Wallet Architecture**: Advanced financial segregation tracking **Deposited Balance** (for ticket purchases), **Winning Balance** (fully withdrawable), and **Bonus Chips** (promotional, non-withdrawable chips for ticket purchases).
- **Dynamic Betting Matrix**: Seamless support for 1D (Single Digit), 2D (Double Digits), 3D (ABC), and 4D (XABC) combination patterns across multiple lottery markets.
- **Automated Payout Engine**: Real-time winner detection and instant balance credit using atomic database transactions.
- **Mandatory Payout Verification**: Secure onboarding workflow requiring verified banking details (Account Holder Name, Account Number, IFSC Code, UPI ID) before ticket purchases or withdrawal requests are permitted.
- **High-Fidelity Ledger & History**: Professional, receipt-style ticket history and a dedicated **Transaction History** hub with live status tracking (Pending, Approved, Rejected, Won, Active).
- **Mobile-Optimized UX**: Platform-wide implementation of native mobile numeric keypads (`inputMode="numeric"`, `pattern="[0-9]*"`) for all amount, phone number, and ticket entry fields, preventing input errors on iOS and Android devices.
- **Flexible Multi-ID Login**: Unified authentication field allowing users to securely log in using their registered Username, Mobile Number, or Email Address.
- **Referral Engine**: Integrated referral system rewarding users with instant bonus chips upon successful friend registration.

### 🛡️ For Administrators
- **Unified Financial Command Center**: Real-time management boards for deposit approvals and withdrawal requests, featuring tabbed interfaces separating **Pending Verification** from **Permanent Audit History**.
- **Advanced Audit Trail & Oversight**: Comprehensive administrative logging capturing transaction IDs, exact timestamps, banking metadata, and custom rejection reasons for full accountability.
- **Time-Locked Announcements & Market Control**: Secure result declaration engine with built-in validation for market-specific slots, including automated **Kerala Lottery Early Closure (02:00 PM)** rules and a master switch for global ticket sales.
- **Deep-Dive User Management**: Detailed player profiles allowing administrators to monitor individual liquidity, adjust triple-balance allocations, update security parameters, and review full transaction histories.
- **Live Intake Monitor**: Real-time analysis of number frequency mapping and combination volume tracking across active draw sessions.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite) with highly optimized Context API (`AuthContext`, `CartContext`, `PaymentContext`) for modular state management.
- **Backend / Database**: Google Firebase Firestore (NoSQL) for real-time synchronization and live query listeners (`onSnapshot`).
- **Authentication**: Firebase Auth with role-based access control (Admin vs. Verified Member) and dynamic multi-identifier resolution.
- **Styling**: Tailwind CSS combined with custom glassmorphic aesthetics, vibrant gradients, and fluid micro-animations.
- **Icons**: Lucide-React for clean, scalable vector iconography.

---

## 📦 Architecture Highlights

- **Catch-Up Audit Engine**: A resilient automated auditing system that ensures winning tickets are accurately processed and credited even if a user logs in days after a result is declared.
- **Fuzzy Sync & Data Normalization**: Built-in whitespace trimming, case normalization, and strict data-type parsing to guarantee flawless synchronization between administrative data entry and client-side evaluation.
- **Atomic Reliability**: Utilizes Firestore `increment`, `updateDoc`, and `writeBatch` to ensure zero race conditions or financial discrepancies during multi-ticket purchases and balance adjustments.

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Firebase Account & Project Configuration (Firestore, Auth)

### Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment:
   Update `src/firebase.js` with your active Firebase project credentials and configuration object.

4. Launch Development Server:
   ```bash
   npm run dev
   ```
5. Production Build:
   ```bash
   npm run build
   ```

---

## 📜 Maintenance & Diagnostic Logging

The platform includes a robust **Diagnostic Logger** for real-time monitoring and debugging. Open the browser developer console (F12) to inspect live operational feeds:
- `[AUDIT]`: Live ticket scanning and catch-up payout logs.
- `[CHECK]`: Real-time match verification between active user tickets and newly declared results.
- `[SYNC]`: Administrative Monitor data intake feed status and live ledger updates.
- `[Identity Dispatch]`: Authentication and recovery link routing logs.

---

*Engineered with precision for secure, transparent, and high-performance digital gaming.*
