
export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  industry: string;
  status: 'Active' | 'Churned' | 'Pending';
  mrr: number; // Monthly Recurring Revenue
  ltv: number; // Lifetime Value
  joinedDate: string;
  avatar: string;
}

export interface RevenueMetric {
  month: string;
  revenue: number;
  expenses: number;
  newCustomers: number;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
  type: 'Invoice' | 'Payment' | 'Refund';
}

export type ViewType = 'dashboard' | 'customers' | 'revenue' | 'insights' | 'customer-profile' | 'activity';
