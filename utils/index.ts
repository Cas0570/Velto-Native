export const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-600';
    case 'sent':
      return 'bg-blue-100 text-blue-600';
    case 'overdue':
      return 'bg-red-100 text-red-600';
    case 'draft':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'paid':
      return 'Betaald';
    case 'sent':
      return 'Verzonden';
    case 'overdue':
      return 'Te laat';
    case 'draft':
      return 'Concept';
    default:
      return 'Onbekend';
  }
};

export const formatCurrency = (amount: number): string => {
  return `€${amount.toLocaleString('nl-NL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
