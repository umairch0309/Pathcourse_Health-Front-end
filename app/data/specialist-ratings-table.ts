export type SpecialistRating = {
  id: string;
  reviewedBy: {
    name: string;
    image: string;
  };
  session: string;
  rating: number;
  reviewText: string;
  submittedOn: string;
};

export const specialistRatings: SpecialistRating[] = [
  {
    id: '51655',
    reviewedBy: { name: 'Cody Fisher', image: '/doc-1.svg' },
    session: 'For My Self',
    rating: 5.0,
    reviewText: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit.',
    submittedOn: 'Dec 30, 2019 07:52',
  },
  {
    id: '51655',
    reviewedBy: { name: 'Kristin Watson', image: '/doc-2.svg' },
    session: 'For Child',
    rating: 5.0,
    reviewText: 'Great service and professional staff. Very satisfied with the treatment.',
    submittedOn: 'Dec 30, 2019 07:52',
  },
  {
    id: '51655',
    reviewedBy: { name: 'Cameron Williamson', image: '/doc-3.svg' },
    session: 'For Child',
    rating: 5.0,
    reviewText: 'Great service and professional staff. Very satisfied with the treatment.',
    submittedOn: 'Dec 30, 2019 07:52',
  },
  {
    id: '51655',
    reviewedBy: { name: 'Theresa Webb', image: '/doc-4.svg' },
    session: 'For Child',
    rating: 5.0,
    reviewText: 'Great service and professional staff. Very satisfied with the treatment.',
    submittedOn: 'Dec 30, 2019 07:52',
  },
  {
    id: '51655',
    reviewedBy: { name: 'Cody Fisher', image: '/doc-1.svg' },
    session: 'For My Self',
    rating: 5.0,
    reviewText: 'Great service and professional staff. Very satisfied with the treatment.',
    submittedOn: 'Dec 30, 2019 07:52',
  },
  {
    id: '51655',
    reviewedBy: { name: 'Kristin Watson', image: '/doc-2.svg' },
    session: 'For Child',
    rating: 5.0,
    reviewText: 'Great service and professional staff. Very satisfied with the treatment.',
    submittedOn: 'Dec 30, 2019 07:52',
  },
  {
    id: '51655',
    reviewedBy: { name: 'Cameron Williamson', image: '/doc-3.svg' },
    session: 'For Child',
    rating: 5.0,
    reviewText: 'Great service and professional staff. Very satisfied with the treatment.',
    submittedOn: 'Dec 30, 2019 07:52',
  },
  {
    id: '51655',
    reviewedBy: { name: 'Theresa Webb', image: '/doc-4.svg' },
    session: 'For Child',
    rating: 5.0,
    reviewText: 'Great service and professional staff. Very satisfied with the treatment.',
    submittedOn: 'Dec 30, 2019 07:52',
  },
  {
    id: '51655',
    reviewedBy: { name: 'Cody Fisher', image: '/doc-1.svg' },
    session: 'For My Self',
    rating: 5.0,
    reviewText: 'Great service and professional staff. Very satisfied with the treatment.',
    submittedOn: 'Dec 30, 2019 07:52',
  },
];

