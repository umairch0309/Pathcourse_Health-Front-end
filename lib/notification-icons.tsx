import type { LucideIcon } from "lucide-react"
import {
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  UserCheck,
  XCircle,
} from "lucide-react"

export type NotificationType =
  | "DOCTOR_ONBOARDING_REQUEST"
  | "DOCTOR_APPROVED"
  | "DOCTOR_REJECTED"
  | "APPOINTMENT_BOOKED"
  | "APPOINTMENT_NO_SHOW"
  | "APPOINTMENT_COMPLETED"
  | "USER_INQUIRY"

export function getNotificationIcon(title: string): {
  icon: LucideIcon
  className: string
} {
  switch (title) {
    case "DOCTOR_ONBOARDING_REQUEST":
      return { icon: UserCheck, className: "text-blue-500" }
    case "DOCTOR_APPROVED":
      return { icon: CheckCircle, className: "text-green-500" }
    case "DOCTOR_REJECTED":
      return { icon: XCircle, className: "text-red-500" }
    case "APPOINTMENT_BOOKED":
      return { icon: Calendar, className: "text-blue-500" }
    case "APPOINTMENT_NO_SHOW":
      return { icon: Clock, className: "text-orange-500" }
    case "APPOINTMENT_COMPLETED":
      return { icon: CheckCircle, className: "text-green-500" }
    case "USER_INQUIRY":
      return { icon: Mail, className: "text-purple-500" }
    default:
      return { icon: Mail, className: "text-gray-500" }
  }
}
