import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type React from "react"
import { OnboardingStage } from "@/types"
import { getCachedSession } from "../../lib/session"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let session: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any

  try {
    session = await getCachedSession()

    // Check if there was an error fetching the session
    if (session.error) {
      console.error("Session fetch error:", session.error)
      redirect("/auth/login")
    }

    user = session.data?.user
  } catch (error) {
    // If backend is unavailable or fetch fails, redirect to login
    console.error("Failed to fetch session:", error)
    redirect("/auth/login")
  }

  // If no user, redirect to signin
  if (!user) {
    console.log(`No user found, redirecting from ${pathname} to /auth/signin`)
    redirect("/auth/login")
  }

  // If user exists but onboarding is not completed, redirect to appropriate auth flow
  if (user) {
    const onboardingStage = user.onboardingStage as OnboardingStage

    // Special handling for WAITING_FOR_ADMIN stage - keep them on waiting page
    if (onboardingStage === OnboardingStage.WAITING_FOR_ADMIN) {
      const isOnWaitingPage =
        pathname === "/onboarding/waiting-for-admin" ||
        pathname === "/onboarding/waiting-for-admin/"
      if (!isOnWaitingPage) {
        console.log(
          `User with WAITING_FOR_ADMIN stage, redirecting from ${pathname} to /onboarding/waiting-for-admin`
        )
        // @ts-expect-error - Next.js route type inference issue
        redirect("/onboarding/waiting-for-admin")
      }
      // Allow them to stay on waiting-for-admin page
      return <>{children}</>
    }

    // Special handling for doctor with DOCTOR_INFO stage - keep them on update-profile
    if (
      user.role === "doctor" &&
      onboardingStage === OnboardingStage.DOCTOR_INFO
    ) {
      const isOnUpdateProfile =
        pathname === "/onboarding/update-profile" ||
        pathname === "/onboarding/update-profile/"
      if (!isOnUpdateProfile) {
        console.log(
          `Doctor with DOCTOR_INFO stage, redirecting from ${pathname} to /onboarding/update-profile`
        )
        // @ts-expect-error - Next.js route type inference issue
        redirect("/onboarding/update-profile")
      }
      // Allow them to stay on update-profile page
      return <>{children}</>
    }

    // If onboarding is not completed, redirect to auth flow
    // Only handle ROLE_SELECTION and USER_INFO stages here
    // WAITING_FOR_ADMIN and DOCTOR_INFO are handled above
    if (
      onboardingStage === OnboardingStage.ROLE_SELECTION ||
      onboardingStage === OnboardingStage.USER_INFO
    ) {
      const stageRoutes: Record<
        OnboardingStage.ROLE_SELECTION | OnboardingStage.USER_INFO,
        string
      > = {
        [OnboardingStage.ROLE_SELECTION]: "/onboarding/role-selection",
        [OnboardingStage.USER_INFO]: "/onboarding/extra-info",
      }

      const redirectRoute = stageRoutes[onboardingStage]
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
