"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"

const roleSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be at most 200 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .or(z.literal("")),
})

type RoleFormData = z.infer<typeof roleSchema>

type CreateRoleRequest = {
  name: string
  description?: string
}

export default function AddRolePage() {
  const router = useRouter()

  const { onRequest, isPending: loading } = useApi<CreateRoleRequest>({
    key: "create-role",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  const handleSubmit = async (data: RoleFormData) => {
    onRequest({
      data: {
        name: data.name,
        description: data.description?.trim() || undefined,
      },
      path: "/api/admin/roles",
      onSuccess: () => {
        setTimeout(() => {
          router.push("/admin/roles" as any)
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
        Add Role
      </Typography>
      <div className="bg-background p-6 rounded-md">
        <FormModified
          schema={roleSchema}
          onSubmit={handleSubmit}
          disabled={loading}
          defaultValues={{
            name: "",
            description: "",
          }}
        >
          {({ components }) => (
            <div className="space-y-6">
              <div>
                <Typography
                  variant="p"
                  className="font-bold text-foreground mb-2"
                >
                  Role Information
                </Typography>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <components.Input
                    name="name"
                    label="Role Name"
                    placeholder="Manager"
                    labelClassName="text-xs text-muted-foreground mb-2"
                  />

                  <components.Textarea
                    name="description"
                    label="Description"
                    placeholder="Manager role with limited permissions"
                    labelClassName="text-xs text-muted-foreground mb-2"
                    rows={4}
                  />
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
                <Button type="submit" disabled={loading}>
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
                    "Create Role"
                  )}
                </Button>
              </div>
            </div>
          )}
        </FormModified>
      </div>
    </div>
  )
}
