import { TextInputProps, TouchableOpacityProps } from 'react-native';

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

export type InvoiceStatus = 'all' | 'draft' | 'sent' | 'paid' | 'overdue';

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
