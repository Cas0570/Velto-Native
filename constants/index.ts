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

export const invoiceSteps = [
  {
    id: 1,
    title: 'Klantgegevens',
    description: 'Voer de gegevens van je klant in',
    icon: 'person' as const,
  },
  {
    id: 2,
    title: 'Factuurregels',
    description: 'Voeg producten of diensten toe',
    icon: 'receipt' as const,
  },
  {
    id: 3,
    title: 'Extra opties',
    description: 'Logo, kleuren en betalingslink',
    icon: 'settings' as const,
  },
  {
    id: 4,
    title: 'Voorvertoning',
    description: 'Controleer je factuur',
    icon: 'preview' as const,
  },
  {
    id: 5,
    title: 'Versturen',
    description: 'Exporteer of verstuur je factuur',
    icon: 'send' as const,
  },
];

export const vatRates = [
  { label: '0%', value: 0 },
  { label: '9%', value: 0.09 },
  { label: '21%', value: 0.21 },
];

export const paymentMethods = [
  {
    key: 'tikkie',
    label: 'Tikkie',
    description: 'Nederlandse betalingsapp',
    icon: 'smartphone',
  },
  {
    key: 'paypal',
    label: 'PayPal',
    description: 'Internationale betalingen',
    icon: 'payment',
  },
  {
    key: 'bank',
    label: 'Bankoverschrijving',
    description: 'Traditionele overschrijving',
    icon: 'account-balance',
  },
];

export const colorOptions = [
  { name: 'Velto Groen', color: '#43d478' },
  { name: 'Blauw', color: '#3b82f6' },
  { name: 'Paars', color: '#8b5cf6' },
  { name: 'Roze', color: '#ec4899' },
  { name: 'Oranje', color: '#f97316' },
  { name: 'Rood', color: '#ef4444' },
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

export const companyData = {
  name: 'Jouw Bedrijf BV',
  email: 'info@jouwbedrijf.nl',
  address: 'Businesslaan 123, 1234 AB Amsterdam',
  iban: 'NL12 BANK 0123 4567 89',
  kvk: '12345678',
  btw: 'NL123456789B01',
};
