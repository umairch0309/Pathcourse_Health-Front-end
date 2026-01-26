"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import FormModified from "@/components/ui/form-modified"
import { Typography } from "@/components/ui/typography"
import { useFetch } from "@/hooks/use-fetch"
import useApi from "@/hooks/use-api"

const teamMemberSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(200, "Name must be at most 200 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be at most 100 characters"),
    roleId: z.string().min(1, "Role is required"),
  })
  .refine((data) => data.roleId !== "", {
    message: "Role is required",
    path: ["roleId"],
  })

type TeamMemberFormData = z.infer<typeof teamMemberSchema>

type CreateTeamMemberRequest = {
  name: string
  email: string
  password: string
  roleId: string
}

interface Role {
  id: string
  name: string
  description: string | null
}

interface RolesResponse {
  roles: Role[]
}

export default function AddTeamMemberPage() {
  const router = useRouter()
  const [selectedRoleId, setSelectedRoleId] = useState<string>("")

  const { data: rolesData, isLoading: isLoadingRoles } =
    useFetch<RolesResponse>({
      path: "/api/admin/roles",
      queryKey: ["admin-roles"],
    })

  const { onRequest, isPending: loading } = useApi<CreateTeamMemberRequest>({
    key: "create-team-member",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  const handleSubmit = async (data: TeamMemberFormData) => {
    onRequest({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        roleId: selectedRoleId,
      },
      path: "/api/admin/team-members",
      onSuccess: () => {
        setTimeout(() => {
          router.push("/admin/team-members" as any)
        }, 1500)
      },
    })
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="w-full">
      <Typography variant="h5" className="font-bold text-foreground mb-4">
        Add Team Member
      </Typography>
      <div className="bg-background p-6 rounded-md">
        {isLoadingRoles ? (
          <div className="flex items-center justify-center py-8">
            <Loader size="lg" variant="spinner" />
          </div>
        ) : (
          <FormModified
            schema={teamMemberSchema}
            onSubmit={handleSubmit}
            disabled={loading}
            defaultValues={{
              name: "",
              email: "",
              password: "",
              roleId: "",
            }}
          >
            {({ components }) => (
              <div className="space-y-6">
                <div>
                  <Typography
                    variant="p"
                    className="font-bold text-foreground mb-2"
                  >
                    Team Member Information
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <components.Input
                      name="name"
                      label="Full Name"
                      placeholder="John Doe"
                      labelClassName="text-xs text-muted-foreground mb-2"
                    />

                    <components.Input
                      name="email"
                      label="Email"
                      type="email"
                      placeholder="john@example.com"
                      labelClassName="text-xs text-muted-foreground mb-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <components.Input
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      labelClassName="text-xs text-muted-foreground mb-2"
                    />

                    <components.Field name="roleId">
                      {(field) => (
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground">
                            Role
                          </label>
                          <Select
                            value={field.value || ""}
                            onValueChange={(value) => {
                              field.onChange(value)
                              setSelectedRoleId(value)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              {rolesData?.roles.map((role) => (
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
                      )}
                    </components.Field>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading || !selectedRoleId}>
                    {loading ? (
                      <>
                        <Loader
                          size="sm"
                          variant="default"
                          color="white"
                          className="mr-2"
                        />
                        Creating...
                      </>
                    ) : (
                      "Create Team Member"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </FormModified>
        )}
      </div>
    </div>
  )
}

