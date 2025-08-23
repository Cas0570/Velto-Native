// Invoice related types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "late";
  createdAt: Date;
  dueDate: Date;
}

export interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
}

// User/Company types
export interface Company {
  id: string;
  name: string;
  address: string;
  kvkNumber?: string;
  vatNumber?: string;
  logoUrl?: string;
  primaryColor?: string;
}

// Client types
export interface Client {
  id: string;
  name: string;
  email: string;
  address?: string;
}
