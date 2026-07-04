export interface Customer {
  id: number;
  account_number: string;
  customer_name: string;
  issue_date: string;
  interest_rate: number;
  tenure: number;
  emi_due: number;
  remaining_balance: number;
  current_emi_status: 'PAID' | 'PENDING';
  last_payment_amount: number | null;
  last_payment_date: string | null;
  last_transaction_id: string | null;
}

export interface PaymentReceipt {
  transactionId: string;
  accountNumber: string;
  customerName: string;
  paymentAmount: number;
  paymentDate: string;
  status: string;
  previousBalance: number;
  newBalance: number;
}

export interface PaymentHistory {
  transaction_id: string;
  payment_date: string;
  payment_amount: number;
  status: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}
