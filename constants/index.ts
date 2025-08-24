import type { InvoiceStatus } from '@/types/type';

import placeholder from '@/assets/images/placeholder.png';
import onboarding1 from '@/assets/images/onboarding1.png';
import onboarding2 from '@/assets/images/onboarding2.png';
import onboarding3 from '@/assets/images/onboarding3.png';
import logo from '@/assets/images/logo.png';
import signUpCar from '@/assets/images/signup-car.png';

import back from '@/assets/icons/back.png';
import person from '@/assets/icons/person.png';
import email from '@/assets/icons/email.png';
import lock from '@/assets/icons/lock.png';
import google from '@/assets/icons/google.png';

export const images = {
  placeholder,
  onboarding1,
  onboarding2,
  onboarding3,
  logo,
  signUpCar,
};

export const icons = {
  back,
  person,
  email,
  lock,
  google,
};

export const onboarding = [
  {
    id: 1,
    title: 'Welcome to Velto!',
    description:
      'Easily create and share sleek payment requests—fast, simple, and professional.',
    image: images.placeholder,
  },
  {
    id: 2,
    title: 'Request. Pay. Done.',
    description:
      'Send branded mini-invoices linked to trusted payment providers like Tikkie or PayPal.',
    image: images.placeholder,
  },
  {
    id: 3,
    title: 'Get Paid Without the Hassle.',
    description: 'Start creating requests today and let Velto handle the rest.',
    image: images.placeholder,
  },
];

export const tabs = [
  { key: 'all' as InvoiceStatus, label: 'Alle', count: 4 },
  { key: 'draft' as InvoiceStatus, label: 'Concepten', count: 1 },
  { key: 'sent' as InvoiceStatus, label: 'Verzonden', count: 1 },
  { key: 'paid' as InvoiceStatus, label: 'Betaald', count: 1 },
  { key: 'overdue' as InvoiceStatus, label: 'Achterstallig', count: 1 },
];

// MOCK DATA
export const mockInvoices = [
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
];
