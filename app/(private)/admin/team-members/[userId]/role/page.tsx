"use client"

import { Check, Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import useApi from "@/hooks/use-api"
import useToast from "@/hooks/use-toast"

interface Role {
  id: string
  name: string
  description: string | null
}

interface RolesResponse {
  roles: Role[]
}

interface TeamMember {
  id: string
  userId: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
    role: string | null
    createdAt: string
  }
  role: Role
  createdAt: string
  updatedAt: string
}

interface TeamMemberResponse {
  teamMember: TeamMember
}

type UpdateRoleRequest = {
  roleId: string
}

export default function ChangeRolePage() {
  const params = useParams()
  const router = useRouter()
  const { toastSuccess, toastError } = useToast()
  const userId = params.userId as string
  const [selectedRoleId, setSelectedRoleId] = useState<string>("")

  const { data: memberData, isLoading: isLoadingMember } =
    useFetch<TeamMemberResponse>({
      path: `/api/admin/team-members/${userId}`,
      queryKey: ["admin-team-member", userId],
    })

  const { data: rolesData, isLoading: isLoadingRoles } =
    useFetch<RolesResponse>({
      path: "/api/admin/roles",
      queryKey: ["admin-roles"],
    })

  const { onRequest: updateRole, isPending: isSaving } =
    useApi<UpdateRoleRequest>({
      key: "update-team-member-role",
      showSuccessToast: true,
      showErrorToast: true,
      method: "patch",
    })

  useEffect(() => {
    if (memberData?.teamMember) {
      setSelectedRoleId(memberData.teamMember.role.id)
    }
  }, [memberData])

  const handleSave = () => {
    if (!selectedRoleId) {
      toastError("Please select a role")
      return
    }

    updateRole({
      data: { roleId: selectedRoleId },
      path: `/api/admin/team-members/${userId}/role`,
      onSuccess: () => {
        setTimeout(() => {
          router.push("/admin/team-members" as any)
        }, 1500)
      },
    })
  }

  if (isLoadingMember || isLoadingRoles) {
    return (
      <div className="w-full">
        <Typography variant="h5" className="font-bold text-foreground mb-4">
          Change Role
        </Typography>
        <div className="bg-background p-6 rounded-md">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  if (!memberData?.teamMember || !rolesData?.roles) {
    return (
      <div className="w-full">
        <Typography variant="h5" className="font-bold text-foreground mb-4">
          Change Role
        </Typography>
        <div className="bg-background p-6 rounded-md">
          <Typography variant="p" className="text-foreground">
            Team member or roles not found
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h5" className="font-bold text-foreground">
          Change Role - {memberData.teamMember.user.name}
        </Typography>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <div className="bg-background p-6 rounded-md space-y-6">
        <div>
          <Typography
            variant="p"
            className="font-bold text-foreground mb-2"
          >
            Current Role
          </Typography>
          <p className="text-sm text-muted-foreground">
            {memberData.teamMember.role.name}
            {memberData.teamMember.role.description && (
              <span className="ml-2">- {memberData.teamMember.role.description}</span>
            )}
          </p>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-2 block">
            Select New Role
          </label>
          <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {rolesData.roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                  {role.description && (
                    <span className="text-muted-foreground ml-2">
                      - {role.description}
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !selectedRoleId}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Update Role
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

