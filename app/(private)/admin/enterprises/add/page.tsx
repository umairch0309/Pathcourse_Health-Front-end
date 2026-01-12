"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import FormModified from "@/components/ui/form-modified"
import { Typography } from "@/components/ui/typography"
import useApi from "@/hooks/use-api"

const enterpriseSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(200, "Name must be at most 200 characters"),
    code: z
      .string()
      .max(50, "Code must be at most 50 characters")
      .optional()
      .or(z.literal("")),
    sessionsPerMonth: z.coerce
      .number()
      .min(0, "Sessions per month must be 0 or greater"),
    generateCode: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // If generateCode is false, code must be provided and not empty
    if (!data.generateCode) {
      if (!data.code || data.code.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Code is required when auto-generation is disabled",
          path: ["code"],
        })
      }
    }
  })

type EnterpriseFormData = z.infer<typeof enterpriseSchema>

type CreateEnterpriseRequest = {
  name: string
  code?: string
  sessionsPerMonth: number
  generateCode: boolean
}

export default function AddEnterprisePage() {
  const router = useRouter()
  const [generateCode, setGenerateCode] = useState(true)

  const { onRequest, isPending: loading } = useApi<CreateEnterpriseRequest>({
    key: "create-enterprise",
    showSuccessToast: true,
    showErrorToast: true,
    method: "post",
  })

  const handleSubmit = async (data: EnterpriseFormData) => {
    onRequest({
      data: {
        name: data.name,
        code: data.generateCode ? undefined : data.code?.trim() || undefined,
        sessionsPerMonth: data.sessionsPerMonth,
        generateCode: data.generateCode,
      },
      path: "/api/enterprises",
      onSuccess: () => {
        setTimeout(() => {
          router.push("/admin/enterprises" as any)
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
        Add Enterprise
      </Typography>
      <div className="bg-background p-6 rounded-md">
        <FormModified
          schema={enterpriseSchema}
          onSubmit={handleSubmit}
          disabled={loading}
          defaultValues={{
            name: "",
            code: undefined,
            sessionsPerMonth: 0,
            generateCode: true,
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
                    name="sessionsPerMonth"
                    label="Sessions Per Month"
                    type="number"
                    placeholder="50"
                    labelClassName="text-xs text-muted-foreground mb-2"
                  />
                </div>

                <div className="mt-4 space-y-4">
                  <components.Field name="generateCode">
                    {(field) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="generateCode"
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                            setGenerateCode(checked as boolean)
                          }}
                          className="border-black"
                        />
                        <Typography
                          variant="span"
                          className="text-foreground/90"
                        >
                          Auto-generate code from name
                        </Typography>
                      </div>
                    )}
                  </components.Field>

                  {!generateCode && (
                    <components.Input
                      name="code"
                      label="Enterprise Code"
                      placeholder="ACME01"
                      labelClassName="text-xs text-muted-foreground mb-2"
                    />
                  )}
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
                    "Create Enterprise"
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
