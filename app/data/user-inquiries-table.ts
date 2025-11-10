export type UserInquiry = {
  id: string;
  user: {
    name: string;
    image: string;
  };
  email: string;
  contactNo: string;
  message: string;
  sentOn: string;
};

export const userInquiries: UserInquiry[] = [
  {
    id: '51655',
    user: { name: 'Cody Fisher', image: '/doc-1.svg' },
    email: 'michelle.rivera@example.com',
    contactNo: '(316) 555-0116',
    message: 'Lorem ipsum dolor sit amet consectetur.',
    sentOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    user: { name: 'Kristin Watson', image: '/doc-2.svg' },
    email: 'michael.mitc@example.com',
    contactNo: '(302) 555-0107',
    message: 'Lorem ipsum dolor sit amet consectetur.',
    sentOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    user: { name: 'Cameron Williamson', image: '/doc-3.svg' },
    email: 'nathan.roberts@example.com',
    contactNo: '(480) 555-0103',
    message: 'Lorem ipsum dolor sit amet consectetur.',
    sentOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    user: { name: 'Theresa Webb', image: '/doc-4.svg' },
    email: 'georgia.young@example.com',
    contactNo: '(252) 555-0126',
    message: 'Lorem ipsum dolor sit amet consectetur.',
    sentOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    user: { name: 'Cody Fisher', image: '/doc-1.svg' },
    email: 'tanya.hill@example.com',
    contactNo: '(303) 555-0105',
    message: 'Lorem ipsum dolor sit amet consectetur.',
    sentOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    user: { name: 'Kristin Watson', image: '/doc-2.svg' },
    email: 'curtis.weaver@example.com',
    contactNo: '(201) 555-0124',
    message: 'Lorem ipsum dolor sit amet consectetur.',
    sentOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    user: { name: 'Cameron Williamson', image: '/doc-3.svg' },
    email: 'nevaeh.simmons@example.com',
    contactNo: '(684) 555-0102',
    message: 'Lorem ipsum dolor sit amet consectetur.',
    sentOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    user: { name: 'Theresa Webb', image: '/doc-4.svg' },
    email: 'alma.lawson@example.com',
    contactNo: '(603) 555-0123',
    message: 'Lorem ipsum dolor sit amet consectetur.',
    sentOn: 'Dec 30, 2019',
  },
  {
    id: '51655',
    user: { name: 'Theresa Webb', image: '/doc-4.svg' },
    email: 'deanna.curtis@example.com',
    contactNo: '(239) 555-0108',
    message: 'Lorem ipsum dolor sit amet consectetur.',
    sentOn: 'Dec 30, 2019',
  },
];

