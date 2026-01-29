/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
"use client"

import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"

import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"

/* ===================== SCHEMA ===================== */

const teamMemberSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  roleId: z.string().min(1),
})

type TeamMemberFormData = z.infer<typeof teamMemberSchema>

interface Role {
  id: string
  name: string
  description: string | null
}

interface RolesResponse {
  roles: Role[]
}

/* ===================== COMPONENT ===================== */

export default function AddTeamMemberPage() {
  const router = useRouter()

  const [selectedRoleId, setSelectedRoleId] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const { data: rolesData, isLoading: isLoadingRoles } =
    useFetch<RolesResponse>({
      path: "/api/admin/roles",
      queryKey: ["admin-roles"],
    })

  const { onRequest, isPending: loading } = useApi<any>({
    key: "create-team-member",
    method: "post",
    showSuccessToast: true,
    showErrorToast: true,
  })

  const handleSubmit = (data: TeamMemberFormData) => {
    onRequest({
      path: "/api/admin/team-members",
      data: {
        ...data,
        roleId: selectedRoleId,
      },
      onSuccess: () => {
        setTimeout(() => router.push("/admin/team-members"), 1200)
      },
    })
  }

  return (
    <div className="w-full">
      <Typography variant="h5" className="font-bold mb-6 text-foreground">
        Add Team Member
      </Typography>

      <div className="bg-background rounded-xl border p-8">
        {isLoadingRoles ? (
          <div className="flex justify-center py-10">
            <Loader size="lg" />
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
              <div className="space-y-8">
                {/* SECTION */}
                <div>
                  <Typography className="font-semibold mb-4 text-foreground">
                    Team Member Information
                  </Typography>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    {/* PASSWORD WITH EYE */}
                    <div className="relative">
                      <components.Input
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        labelClassName="text-xs text-muted-foreground mb-2"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* ROLE SELECT */}
                    <components.Field name="roleId">
                      {(field) => (
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground">
                            Role
                          </label>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value)
                              setSelectedRoleId(value)
                            }}
                          >
                            <SelectTrigger className="h-10 border-0 border-b-2 border-border rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:outline-0 focus:border-primary text-sm">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              {rolesData?.roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  <div className="flex flex-col">
                                    <span>{role.name}</span>
                                    {role.description && (
                                      <span className="text-xs text-muted-foreground">
                                        {role.description}
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </components.Field>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.back()}
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
