export type Post = {
  id: number
  title: string
  body: string
  userId: number
}

export enum OnboardingStage {
  ROLE_SELECTION = "ROLE_SELECTION",
  USER_INFO = "USER_INFO",
  DOCTOR_INFO = "DOCTOR_INFO",
  WAITING_FOR_ADMIN = "WAITING_FOR_ADMIN",
  COMPLETED = "COMPLETED",
}
