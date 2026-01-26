export type SpecialistPayment = {
  id: string
  receivedFrom: {
    name: string
    image: string
  }
  amount: string
  sessionFor: string
  receivedOn: string
}

export const specialistPayments: SpecialistPayment[] = [
  {
    id: "51655",
    receivedFrom: { name: "Cody Fisher", image: "/doc-1.svg" },
    amount: "$450.54",
    sessionFor: "For My Self",
    receivedOn: "Dec 30, 2019",
  },
  {
    id: "51655",
    receivedFrom: { name: "Kristin Watson", image: "/doc-2.svg" },
    amount: "$589.99",
    sessionFor: "For Child",
    receivedOn: "Dec 30, 2019",
  },
  {
    id: "51655",
    receivedFrom: { name: "Cameron Williamson", image: "/doc-3.svg" },
    amount: "$948.55",
    sessionFor: "For Child",
    receivedOn: "Dec 30, 2019",
  },
  {
    id: "51655",
    receivedFrom: { name: "Theresa Webb", image: "/doc-4.svg" },
    amount: "$710.68",
    sessionFor: "For Child",
    receivedOn: "Dec 30, 2019",
  },
  {
    id: "51655",
    receivedFrom: { name: "Cody Fisher", image: "/doc-1.svg" },
    amount: "$450.54",
    sessionFor: "For My Self",
    receivedOn: "Dec 30, 2019",
  },
  {
    id: "51655",
    receivedFrom: { name: "Kristin Watson", image: "/doc-2.svg" },
    amount: "$589.99",
    sessionFor: "For Child",
    receivedOn: "Dec 30, 2019",
  },
  {
    id: "51655",
    receivedFrom: { name: "Cameron Williamson", image: "/doc-3.svg" },
    amount: "$948.55",
    sessionFor: "For Child",
    receivedOn: "Dec 30, 2019",
  },
  {
    id: "51655",
    receivedFrom: { name: "Theresa Webb", image: "/doc-4.svg" },
    amount: "$710.68",
    sessionFor: "For Child",
    receivedOn: "Dec 30, 2019",
  },
  {
    id: "51655",
    receivedFrom: { name: "Cody Fisher", image: "/doc-1.svg" },
    amount: "$450.54",
    sessionFor: "For My Self",
    receivedOn: "Dec 30, 2019",
  },
]
