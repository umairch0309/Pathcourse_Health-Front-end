export type SpecialistRating = {
  user: string // User ID number
  sessionReason: string // Answer given by Specialist at end of session
  rating: number
  reviewText: string
  submittedOn: string
}

export const specialistRatings: SpecialistRating[] = [
  {
    user: "51655",
    sessionReason:
      "Patient reported feeling anxious and stressed about work deadlines",
    rating: 5.0,
    reviewText:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit.",
    submittedOn: "Dec 30, 2019 07:52",
  },
  {
    user: "51656",
    sessionReason: "Child experiencing difficulty sleeping and nightmares",
    rating: 5.0,
    reviewText:
      "Great service and professional staff. Very satisfied with the treatment.",
    submittedOn: "Dec 30, 2019 07:52",
  },
  {
    user: "51657",
    sessionReason:
      "Teenager struggling with school performance and peer relationships",
    rating: 5.0,
    reviewText:
      "Great service and professional staff. Very satisfied with the treatment.",
    submittedOn: "Dec 30, 2019 07:52",
  },
  {
    user: "51658",
    sessionReason: "Child showing signs of social anxiety in group settings",
    rating: 5.0,
    reviewText:
      "Great service and professional staff. Very satisfied with the treatment.",
    submittedOn: "Dec 30, 2019 07:52",
  },
  {
    user: "51659",
    sessionReason: "Patient seeking help with managing chronic pain and stress",
    rating: 5.0,
    reviewText:
      "Great service and professional staff. Very satisfied with the treatment.",
    submittedOn: "Dec 30, 2019 07:52",
  },
  {
    user: "51660",
    sessionReason:
      "Adolescent dealing with family conflict and emotional regulation",
    rating: 5.0,
    reviewText:
      "Great service and professional staff. Very satisfied with the treatment.",
    submittedOn: "Dec 30, 2019 07:52",
  },
  {
    user: "51661",
    sessionReason:
      "Child having trouble focusing in school and completing homework",
    rating: 5.0,
    reviewText:
      "Great service and professional staff. Very satisfied with the treatment.",
    submittedOn: "Dec 30, 2019 07:52",
  },
  {
    user: "51662",
    sessionReason:
      "Patient experiencing grief and loss after recent family event",
    rating: 5.0,
    reviewText:
      "Great service and professional staff. Very satisfied with the treatment.",
    submittedOn: "Dec 30, 2019 07:52",
  },
  {
    user: "51663",
    sessionReason:
      "Individual seeking support for work-life balance and burnout",
    rating: 5.0,
    reviewText:
      "Great service and professional staff. Very satisfied with the treatment.",
    submittedOn: "Dec 30, 2019 07:52",
  },
]
