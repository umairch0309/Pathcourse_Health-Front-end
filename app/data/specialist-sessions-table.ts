export type SpecialistSession = {
  id: string
  user: {
    name: string
    image: string
  }
  sessionFor: string
  sessionDuration?: string
  dateTime?: string
  sessionLink?: string
}

export const availableSessions: SpecialistSession[] = [
  {
    id: "51655",
    user: { name: "Cody Fisher", image: "/doc-1.svg" },
    sessionFor: "For My Self",
    sessionDuration: "Dec 30, 2019 07:52",
    sessionLink: "https://meet.example.com/session-1",
  },
  {
    id: "51655",
    user: { name: "Kristin Watson", image: "/doc-2.svg" },
    sessionFor: "For Child",
    sessionDuration: "Dec 30, 2019 08:30",
    sessionLink: "https://meet.example.com/session-2",
  },
  {
    id: "51655",
    user: { name: "Cameron Williamson", image: "/doc-3.svg" },
    sessionFor: "For Child",
    sessionDuration: "Dec 30, 2019 09:15",
    sessionLink: "https://meet.example.com/session-3",
  },
  {
    id: "51655",
    user: { name: "Theresa Webb", image: "/doc-4.svg" },
    sessionFor: "For Child",
    sessionDuration: "Dec 30, 2019 10:00",
    sessionLink: "https://meet.example.com/session-4",
  },
  {
    id: "51655",
    user: { name: "Cody Fisher", image: "/doc-1.svg" },
    sessionFor: "For My Self",
    sessionDuration: "Dec 30, 2019 11:00",
    sessionLink: "https://meet.example.com/session-5",
  },
  {
    id: "51655",
    user: { name: "Kristin Watson", image: "/doc-2.svg" },
    sessionFor: "For Child",
    sessionDuration: "Dec 30, 2019 12:00",
    sessionLink: "https://meet.example.com/session-6",
  },
]

export const attendedSessions: SpecialistSession[] = [
  {
    id: "51655",
    user: { name: "Cody Fisher", image: "/doc-1.svg" },
    sessionFor: "For My Self",
    dateTime: "Dec 30, 2019 07:52",
  },
  {
    id: "51655",
    user: { name: "Kristin Watson", image: "/doc-2.svg" },
    sessionFor: "For Child",
    dateTime: "Dec 30, 2019 07:52",
  },
  {
    id: "51655",
    user: { name: "Cameron Williamson", image: "/doc-3.svg" },
    sessionFor: "For Child",
    dateTime: "Dec 30, 2019 07:52",
  },
  {
    id: "51655",
    user: { name: "Theresa Webb", image: "/doc-4.svg" },
    sessionFor: "For Child",
    dateTime: "Dec 30, 2019 07:52",
  },
  {
    id: "51655",
    user: { name: "Cody Fisher", image: "/doc-1.svg" },
    sessionFor: "For My Self",
    dateTime: "Dec 30, 2019 07:52",
  },
  {
    id: "51655",
    user: { name: "Kristin Watson", image: "/doc-2.svg" },
    sessionFor: "For Child",
    dateTime: "Dec 30, 2019 07:52",
  },
  {
    id: "51655",
    user: { name: "Cameron Williamson", image: "/doc-3.svg" },
    sessionFor: "For Child",
    dateTime: "Dec 30, 2019 07:52",
  },
  {
    id: "51655",
    user: { name: "Theresa Webb", image: "/doc-4.svg" },
    sessionFor: "For Child",
    dateTime: "Dec 30, 2019 07:52",
  },
]
