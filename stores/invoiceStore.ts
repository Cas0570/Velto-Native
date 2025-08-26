import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { InvoiceLineItem } from '@/types/type';

// Extended invoice type for store
export interface Invoice {
  id: string;
  clientName: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  clientInfo: {
    name: string;
    email: string;
    address: string;
    phone?: string;
  };
  invoiceLines: InvoiceLineItem[];
  totals: {
    subtotal: number;
    vat: number;
    total: number;
  };
  paymentMethod: 'tikkie' | 'paypal' | 'bank';
  dueDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceState {
  // State
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;

  // Computed values
  totalOutstanding: number;
  thisMonthTotal: number;
  paidCount: number;
  sentCount: number;
  overdueCount: number;
  draftCount: number;

  // Actions
  fetchInvoices: () => Promise<void>;
  addInvoice: (
    invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  getInvoicesByStatus: (status: Invoice['status']) => Invoice[];
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Helper function to generate detailed mock data
const generateDetailedInvoiceData = (baseInvoice: any): Invoice => {
  const subtotal = baseInvoice.amount / 1.21;
  const vat = baseInvoice.amount - subtotal;

  return {
    ...baseInvoice,
    clientInfo: {
      name: baseInvoice.clientName,
      email:
        'contact@' +
        baseInvoice.clientName.toLowerCase().replace(/\s+/g, '') +
        '.com',
      address: 'Keizersgracht 123, 1015 CJ Amsterdam',
      phone: '+31 20 123 4567',
    },
    invoiceLines: [
      {
        id: '1',
        description: 'Website Development',
        quantity: 1,
        unitPrice: subtotal * 0.7,
        vatRate: 0.21,
        total: subtotal * 0.7 * 1.21,
      },
      {
        id: '2',
        description: 'SEO Optimization',
        quantity: 1,
        unitPrice: subtotal * 0.3,
        vatRate: 0.21,
        total: subtotal * 0.3 * 1.21,
      },
    ],
    totals: {
      subtotal,
      vat,
      total: baseInvoice.amount,
    },
    paymentMethod: 'bank' as const,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    notes:
      'Betaling binnen 30 dagen na factuurdatum. Bij vragen kunt u contact opnemen.',
    createdAt: new Date(baseInvoice.date).toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Initial mock data (will be replaced by API calls)
const initialMockInvoices = [
  {
    id: '001',
    clientName: 'Acme BV',
    invoiceNumber: '#001',
    date: '2024-01-15',
    amount: 1250.0,
    status: 'paid' as const,
  },
  {
    id: '002',
    clientName: 'Tech Solutions',
    invoiceNumber: '#002',
    date: '2024-01-12',
    amount: 850.5,
    status: 'sent' as const,
  },
  {
    id: '003',
    clientName: 'Creative Agency',
    invoiceNumber: '#003',
    date: '2024-01-10',
    amount: 2100.0,
    status: 'overdue' as const,
  },
  {
    id: '004',
    clientName: 'StartupXYZ',
    invoiceNumber: '#004',
    date: '2024-01-08',
    amount: 750.0,
    status: 'draft' as const,
  },
].map(generateDetailedInvoiceData);

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      // Initial state
      invoices: [],
      isLoading: false,
      error: null,

      // Computed values (getters)
      get totalOutstanding() {
        const invoices = get().invoices;
        return invoices
          .filter((inv) => inv.status === 'sent' || inv.status === 'overdue')
          .reduce((sum, inv) => sum + inv.amount, 0);
      },

      get thisMonthTotal() {
        const invoices = get().invoices;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        return invoices
          .filter((inv) => {
            const invDate = new Date(inv.date);
            return (
              invDate.getMonth() === currentMonth &&
              invDate.getFullYear() === currentYear
            );
          })
          .reduce((sum, inv) => sum + inv.amount, 0);
      },

      get paidCount() {
        return get().invoices.filter((inv) => inv.status === 'paid').length;
      },

      get sentCount() {
        return get().invoices.filter((inv) => inv.status === 'sent').length;
      },

      get overdueCount() {
        return get().invoices.filter((inv) => inv.status === 'overdue').length;
      },

      get draftCount() {
        return get().invoices.filter((inv) => inv.status === 'draft').length;
      },

      // Actions
      fetchInvoices: async () => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // In a real app, this would be an actual API call
          // const response = await fetch('/api/invoices');
          // const invoices = await response.json();

          // For now, use mock data
          set({
            invoices: initialMockInvoices,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: 'Failed to fetch invoices',
            isLoading: false,
          });
        }
      },

      addInvoice: (invoiceData) => {
        const newInvoice: Invoice = {
          ...invoiceData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          invoices: [...state.invoices, newInvoice],
        }));
      },

      updateInvoice: (id, updates) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id
              ? { ...invoice, ...updates, updatedAt: new Date().toISOString() }
              : invoice
          ),
        }));
      },

      deleteInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== id),
        }));
      },

      updateInvoiceStatus: (id, status) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) =>
            invoice.id === id
              ? { ...invoice, status, updatedAt: new Date().toISOString() }
              : invoice
          ),
        }));
      },

      getInvoiceById: (id) => {
        return get().invoices.find((invoice) => invoice.id === id);
      },

      getInvoicesByStatus: (status) => {
        return get().invoices.filter((invoice) => invoice.status === status);
      },

      clearError: () => set({ error: null }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'invoice-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the invoices, not loading states
      partialize: (state) => ({ invoices: state.invoices }),
    }
  )
);
