export type Transaction = {
  id: string;
  specialist: {
    name: string;
    image: string;
  };
  user: {
    name: string;
    image: string;
  };
  amountPaid: string;
  status: 'Paid' | 'Pending' | 'Cancelled';
  paidOn: string;
};

export const transactions: Transaction[] = [
  {
    id: '51655',
    specialist: { name: 'Cody Fisher', image: '/doc-1.svg' },
    user: { name: 'Cody Fisher', image: '/doc-1.svg' },
    amountPaid: '$328.85',
    status: 'Paid',
    paidOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    specialist: { name: 'Kristin Watson', image: '/doc-2.svg' },
    user: { name: 'Kristin Watson', image: '/doc-2.svg' },
    amountPaid: '$351.02',
    status: 'Pending',
    paidOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    specialist: { name: 'Cameron Williamson', image: '/doc-3.svg' },
    user: { name: 'Cameron Williamson', image: '/doc-3.svg' },
    amountPaid: '$782.01',
    status: 'Cancelled',
    paidOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    specialist: { name: 'Theresa Webb', image: '/doc-4.svg' },
    user: { name: 'Theresa Webb', image: '/doc-4.svg' },
    amountPaid: '$105.55',
    status: 'Paid',
    paidOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    specialist: { name: 'Cody Fisher', image: '/doc-1.svg' },
    user: { name: 'Cody Fisher', image: '/doc-1.svg' },
    amountPaid: '$450.54',
    status: 'Pending',
    paidOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    specialist: { name: 'Kristin Watson', image: '/doc-2.svg' },
    user: { name: 'Kristin Watson', image: '/doc-2.svg' },
    amountPaid: '$630.44',
    status: 'Paid',
    paidOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    specialist: { name: 'Cameron Williamson', image: '/doc-3.svg' },
    user: { name: 'Cameron Williamson', image: '/doc-3.svg' },
    amountPaid: '$928.41',
    status: 'Cancelled',
    paidOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    specialist: { name: 'Theresa Webb', image: '/doc-4.svg' },
    user: { name: 'Theresa Webb', image: '/doc-4.svg' },
    amountPaid: '$779.58',
    status: 'Paid',
    paidOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    specialist: { name: 'Cody Fisher', image: '/doc-1.svg' },
    user: { name: 'Cody Fisher', image: '/doc-1.svg' },
    amountPaid: '$328.85',
    status: 'Pending',
    paidOn: 'Dec 30, 2019',
  },
];

