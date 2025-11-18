import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type React from "react"
import { getCachedSession } from "../../lib/session"
import { OnboardingStage } from "@/types"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""

  const session = await getCachedSession()

  const user = session.data?.user

  // If no user, redirect to signin
  if (!user) {
    console.log(`No user found, redirecting from ${pathname} to /auth/signin`)
    redirect("/auth/login")
  }

  // If user exists but onboarding is not completed, redirect to appropriate auth flow
  if (user) {
    const onboardingStage = user.onboardingStage as OnboardingStage

    // If onboarding is not completed, redirect to auth flow
    if (onboardingStage !== OnboardingStage.COMPLETED) {
      const stageRoutes = {
        [OnboardingStage.ROLE_SELECTION]: "/onboarding/role-selection",
        [OnboardingStage.USER_INFO]: "/onboarding/extra-info",
      }

      const redirectRoute =
        stageRoutes[onboardingStage] || "/onboarding/role-selection"
      console.log(
        `User onboarding not completed (stage: ${onboardingStage}), redirecting from ${pathname} to ${redirectRoute}`
      )
      // @ts-expect-error - Next.js route type inference issue
      redirect(redirectRoute)
    }

    // Check role-based access
    const isAdminRoute = pathname.startsWith("/admin")
    const isDoctorRoute = pathname.startsWith("/specialist")
    const isPatientRoute = pathname.startsWith("/patient")

    if (isAdminRoute && user.role !== "admin") {
      console.log(
        `Non-admin user accessing admin route, redirecting to appropriate dashboard`
      )
      const userDashboard =
        user.role === "doctor"
          ? "/specialist"
          : user.role === "patient"
            ? "/patient"
            : "/"
      redirect(userDashboard)
    }

    if (isDoctorRoute && user.role !== "doctor") {
      console.log(
        `Non-doctor user accessing doctor route, redirecting to appropriate dashboard`
      )
      const userDashboard =
        user.role === "admin"
          ? "/admin"
          : user.role === "patient"
            ? "/patient"
            : "/"
      redirect(userDashboard)
    }

    if (isPatientRoute && user.role !== "patient") {
      console.log(
        `Non-patient user accessing patient route, redirecting to appropriate dashboard`
      )
      const userDashboard =
        user.role === "admin"
          ? "/admin"
          : user.role === "doctor"
            ? "/specialist"
            : "/"
      redirect(userDashboard)
    }
  }

  return <>{children}</>
}