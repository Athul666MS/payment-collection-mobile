import { PaymentReceipt } from '../types';

export type RootStackParamList = {
  Home: undefined;
  LoanDetails: { accountNumber: string };
  Payment: { accountNumber: string; emiDue: number; remainingBalance: number };
  PaymentSuccess: { receipt: PaymentReceipt };
  PaymentHistory: { accountNumber: string };
};
