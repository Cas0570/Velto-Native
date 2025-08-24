import { z } from 'zod';

// Step 1: Client Info validation
export const clientInfoSchema = z.object({
  clientName: z
    .string()
    .min(2, '(Bedrijfs)naam moet minimaal 2 karakters zijn'),
  clientEmail: z.string().email('Voer een geldig e-mailadres in'),
  clientAddress: z.string().optional(),
  clientCity: z.string().optional(),
  clientPostalCode: z.string().optional(),
});

// Step 2: Invoice Lines validation
export const invoiceLineSchema = z.object({
  description: z.string().min(1, 'Omschrijving is verplicht'),
  quantity: z.number().min(1, 'Aantal moet minimaal 1 zijn'),
  unitPrice: z.number().min(0.01, 'Prijs moet minimaal €0,01 zijn'),
  vatRate: z.number().min(0).max(100, 'BTW-tarief moet tussen 0 en 100% zijn'),
});

export const invoiceLinesSchema = z.object({
  lines: z.array(invoiceLineSchema).min(1, 'Voeg minimaal één factuuregel toe'),
});

// Step 3: Extra Options validation
export const extraOptionsSchema = z.object({
  notes: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().optional(),
  paymentLink: z.string().url().optional().or(z.literal('')),
});

// Complete invoice validation
export const completeInvoiceSchema = z.object({
  client: clientInfoSchema,
  lines: z.array(invoiceLineSchema),
  extraOptions: extraOptionsSchema.optional(),
});
