"use client"

import { useParams, useRouter } from "next/navigation"
import { z } from "zod"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"
import { useFetch } from "@/hooks/use-fetch"

const enterpriseSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be at most 200 characters"),
  code: z
    .string()
    .min(1, "Code is required")
    .max(50, "Code must be at most 50 characters"),
  sessionsPerMonth: z.coerce
    .number()
    .min(0, "Sessions per month must be 0 or greater"),
})

type EnterpriseFormData = z.infer<typeof enterpriseSchema>

type UpdateEnterpriseRequest = {
  name?: string
  code?: string
  sessionsPerMonth?: number
}

type Enterprise = {
  id: string
  name: string
  code: string
  sessionsPerMonth: number
  createdAt: string
  updatedAt: string
}

export default function EditEnterprisePage() {
  const router = useRouter()
  const params = useParams()
  const enterpriseId = Array.isArray(params.id) ? params.id[0] : params.id

  const {
    data: enterprise,
    isLoading,
    error,
  } = useFetch<Enterprise>({
    path: `/api/enterprises/${enterpriseId}`,
    queryKey: ["enterprise", enterpriseId],
  })

  const { onRequest, isPending: loading } = useApi<UpdateEnterpriseRequest>({
    key: "update-enterprise",
    showSuccessToast: true,
    showErrorToast: true,
    method: "put",
  })

  const handleSubmit = async (data: EnterpriseFormData) => {
    onRequest({
      data: {
        name: data.name,
        code: data.code,
        sessionsPerMonth: data.sessionsPerMonth,
      },
      path: `/api/enterprises/${enterpriseId}`,
      onSuccess: () => {
        setTimeout(() => {
          router.push("/admin/enterprises")
        }, 1500)
      },
    })
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center p-8">
        <Loader size="md" variant="default" />
      </div>
    )
  }

  if (error || !enterprise) {
    return (
      <div className="w-full">
        <Typography variant="h5" className="font-bold text-foreground mb-4">
          Edit Enterprise
        </Typography>
        <div className="bg-background p-6 rounded-md">
          <Typography variant="p" className="text-destructive">
            {error
              ? "Failed to load enterprise. Please try again."
              : "Enterprise not found."}
          </Typography>
          <Button variant="outline" onClick={handleCancel} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Typography variant="h5" className="font-bold text-foreground mb-4">
        Edit Enterprise
      </Typography>
      <div className="bg-background p-6 rounded-md">
        <FormModified
          schema={enterpriseSchema}
          onSubmit={handleSubmit}
          disabled={loading}
          defaultValues={{
            name: enterprise.name,
            code: enterprise.code,
            sessionsPerMonth: enterprise.sessionsPerMonth,
          }}
        >
          {({ components }) => (
            <div className="space-y-6">
              <div>
                <Typography
                  variant="p"
                  className="font-bold text-foreground mb-2"
                >
                  Enterprise Information
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <components.Input
                    name="name"
                    label="Enterprise Name"
                    placeholder="Acme Corporation"
                    labelClassName="text-xs text-muted-foreground mb-2"
                  />

                  <components.Input
                    name="code"
                    label="Enterprise Code"
                    placeholder="ACME01"
                    labelClassName="text-xs text-muted-foreground mb-2"
                  />

                  <components.Input
                    name="sessionsPerMonth"
                    label="Sessions Per Month"
                    type="number"
                    placeholder="50"
                    labelClassName="text-xs text-muted-foreground mb-2"
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
                  {loading ? "Updating..." : "Update Enterprise"}
                </Button>
              </div>
            </div>
          )}
        </FormModified>
      </div>
    </div>
  )
}
