import * as React from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

const PaymentContext = React.createContext();

export const usePayment = () => {
  const context = React.useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  // Use a single fixed admin payment configuration as requested
  const [activePayment] = React.useState({
    id: 1,
    upiId: 'smserode143-5@okicici',
    bankName: 'UPI PAYMENT', // Generic label
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent('upi://pay?pa=smserode143-5@okicici&cu=INR')}`
  });

  return (
    <PaymentContext.Provider value={{ 
      activePayment, 
      accounts: [activePayment], // Keep for backward compatibility if needed in UI
      paymentConfig: { mode: 'manual', manualAccountId: 1 }
    }}>
      {children}
    </PaymentContext.Provider>
  );
};
