
import { Customer, RevenueMetric, Transaction } from './types';

export const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@techflow.io', company: 'TechFlow', industry: 'SaaS', status: 'Active', mrr: 1200, ltv: 14400, joinedDate: '2023-01-15', avatar: 'https://picsum.photos/seed/1/100' },
  { id: '2', name: 'Bob Smith', email: 'bob@greenlight.com', company: 'GreenLight', industry: 'Energy', status: 'Active', mrr: 850, ltv: 10200, joinedDate: '2023-03-10', avatar: 'https://picsum.photos/seed/2/100' },
  { id: '3', name: 'Charlie Davis', email: 'charlie@nexus.net', company: 'Nexus Systems', industry: 'Infrastructure', status: 'Churned', mrr: 0, ltv: 4500, joinedDate: '2022-11-20', avatar: 'https://picsum.photos/seed/3/100' },
  { id: '4', name: 'Diana Prince', email: 'diana@themis.org', company: 'Themis Law', industry: 'Legal', status: 'Active', mrr: 2100, ltv: 25200, joinedDate: '2023-05-05', avatar: 'https://picsum.photos/seed/4/100' },
  { id: '5', name: 'Ethan Hunt', email: 'ethan@imf.gov', company: 'IMF Agency', industry: 'Security', status: 'Pending', mrr: 500, ltv: 0, joinedDate: '2024-02-12', avatar: 'https://picsum.photos/seed/5/100' },
  { id: '6', name: 'Fiona Gallagher', email: 'fiona@southside.co', company: 'SouthSide', industry: 'Retail', status: 'Active', mrr: 750, ltv: 9000, joinedDate: '2023-08-25', avatar: 'https://picsum.photos/seed/6/100' },
  { id: '7', name: 'George Costanza', email: 'george@vandelay.com', company: 'Vandelay Ind.', industry: 'Manufacturing', status: 'Active', mrr: 3200, ltv: 38400, joinedDate: '2023-02-01', avatar: 'https://picsum.photos/seed/7/100' },
];

export const MOCK_REVENUE: RevenueMetric[] = [
  { month: 'Jan', revenue: 45000, expenses: 22000, newCustomers: 12 },
  { month: 'Feb', revenue: 52000, expenses: 24000, newCustomers: 15 },
  { month: 'Mar', revenue: 48000, expenses: 23000, newCustomers: 8 },
  { month: 'Apr', revenue: 61000, expenses: 28000, newCustomers: 22 },
  { month: 'May', revenue: 65000, expenses: 30000, newCustomers: 19 },
  { month: 'Jun', revenue: 72000, expenses: 32000, newCustomers: 25 },
  { month: 'Jul', revenue: 80000, expenses: 35000, newCustomers: 30 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX-9001', customerId: '1', customerName: 'Alice Johnson', amount: 1200.00, status: 'Paid', date: '2024-02-28', type: 'Payment' },
  { id: 'TX-9002', customerId: '7', customerName: 'George Costanza', amount: 3200.00, status: 'Paid', date: '2024-02-27', type: 'Payment' },
  { id: 'TX-9003', customerId: '4', customerName: 'Diana Prince', amount: 2100.00, status: 'Pending', date: '2024-02-26', type: 'Invoice' },
  { id: 'TX-9004', customerId: '2', customerName: 'Bob Smith', amount: 850.00, status: 'Overdue', date: '2024-02-15', type: 'Invoice' },
  { id: 'TX-9005', customerId: '6', customerName: 'Fiona Gallagher', amount: 750.00, status: 'Paid', date: '2024-02-10', type: 'Payment' },
  { id: 'TX-9006', customerId: '5', customerName: 'Ethan Hunt', amount: 500.00, status: 'Pending', date: '2024-02-28', type: 'Invoice' },
  { id: 'TX-9007', customerId: '3', customerName: 'Charlie Davis', amount: 450.00, status: 'Paid', date: '2024-01-15', type: 'Refund' },
  { id: 'TX-9008', customerId: '1', customerName: 'Alice Johnson', amount: 1200.00, status: 'Paid', date: '2024-01-28', type: 'Payment' },
  { id: 'TX-9009', customerId: '7', customerName: 'George Costanza', amount: 3200.00, status: 'Paid', date: '2024-01-27', type: 'Payment' },
  { id: 'TX-9010', customerId: '4', customerName: 'Diana Prince', amount: 2100.00, status: 'Paid', date: '2024-01-25', type: 'Payment' },
];
