import { TextInputProps, TouchableOpacityProps } from 'react-native';

// Component Props
declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success';
  textVariant?: 'primary' | 'default' | 'secondary' | 'danger' | 'success';
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

declare interface InvoiceCardProps {
  invoice: {
    id: string;
    clientName: string;
    invoiceNumber: string;
    date: string;
    amount: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
  };
  onPress?: () => void;
  showBorder?: boolean;
  size?: 'small' | 'large';
  className?: string;
}

declare interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  logoText?: string;
  rightElement?: React.ReactNode;
  onLogoPress?: () => void;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

declare interface StepIndicatorStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

declare interface StepIndicatorProps {
  steps: StepIndicatorStep[];
  currentStep: number;
  className?: string;
}

export type InvoiceStatus = 'all' | 'draft' | 'sent' | 'paid' | 'overdue';

// New Invoice Creation Types
export interface NewInvoiceData {
  // Step 1: Client Info
  clientInfo: {
    name: string;
    email: string;
    straat: string;
    postcode: string;
    huisnummer: string;
    phone?: string;
  };
  // Step 2: Invoice Lines
  invoiceLines: InvoiceLineItem[];
  // Step 3: Extra Options
  options: {
    logo?: string;
    primaryColor?: string;
    notes?: string;
    paymentLink?: string;
    paymentMethod?: 'tikkie' | 'paypal' | 'bank';
  };
  // Step 4: Preview (calculated fields)
  calculated: {
    subtotal: number;
    totalVat: number;
    total: number;
    invoiceNumber: string;
    dueDate: string;
  };
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
}

export interface NewInvoiceStepProps {
  data: NewInvoiceData;
  onUpdate: (data: Partial<NewInvoiceData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading?: boolean;
}

// Possible types?????
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'late';
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
