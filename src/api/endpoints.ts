import axiosClient from './axiosClient';
import { ApiResponse, Customer, PaymentReceipt, PaymentHistory } from '../types';

export const getAllCustomers = async (): Promise<Customer[]> => {
  const response = await axiosClient.get<ApiResponse<{ customers: Customer[] }>>('/customers');
  return response.data.data.customers;
};

export const getCustomerByAccount = async (accountNumber: string): Promise<Customer> => {
  const response = await axiosClient.get<ApiResponse<{ customer: Customer }>>(
    `/customers/${accountNumber}`,
  );
  return response.data.data.customer;
};

export const makePayment = async (
  accountNumber: string,
  amount: number,
): Promise<PaymentReceipt> => {
  const response = await axiosClient.post<ApiResponse<{ receipt: PaymentReceipt }>>(
    '/payments',
    { accountNumber, amount },
  );
  return response.data.data.receipt;
};

export const getPaymentHistory = async (accountNumber: string): Promise<PaymentHistory[]> => {
  const response = await axiosClient.get<ApiResponse<{ history: PaymentHistory[] }>>(
    `/payments/${accountNumber}`,
  );
  return response.data.data.history;
};
