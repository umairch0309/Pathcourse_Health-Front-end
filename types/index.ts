export type Post = {
  id: number
  title: string
  body: string
  userId: number
}

export enum OnboardingStage {
  ROLE_SELECTION = "ROLE_SELECTION",
  USER_INFO = "USER_INFO",
  COMPLETED = "COMPLETED",
}