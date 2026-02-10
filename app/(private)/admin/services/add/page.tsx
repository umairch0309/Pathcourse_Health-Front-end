"use client"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import type { UseFormReturn } from "react-hook-form"
import { useFieldArray } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import FormModified from "@/components/ui/form-modified"
import { Typography } from "@/components/ui/typography"

const addServiceSchema = z.object({
  serviceTitle: z.string().min(1, "Service title is required"),
  subServices: z.array(
    z.object({
      duration: z.string().min(1, "Duration is required"),
      price: z.string().min(1, "Price is required"),
    })
  ),
})

type AddServiceFormData = z.infer<typeof addServiceSchema>

type SubServicesSectionProps = {
  components: any
  methods: UseFormReturn<AddServiceFormData>
}

function SubServicesSection({ components, methods }: SubServicesSectionProps) {
  const { fields, append, remove } = useFieldArray<AddServiceFormData>({
    control: methods.control,
    name: "subServices",
  })

  return (
    <div className=" pt-2">
      <Typography variant="p" className="font-semibold text-foreground mb-4">
        Add Time Durations
      </Typography>
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-1 lg:grid-cols-4 mb-2">
          <components.Input
            name={`subServices.${index}.duration` as any}
            placeholder="15 min"
            className="w-full lg:border-r"
          />
          <components.Input
            name={`subServices.${index}.price` as any}
            placeholder="e.g. $300.00"
            className="w-full p-2"
          />
          <div className="flex items-center lg:ml-2 p-2">
            {fields.length > 1 && index > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => append({ duration: "", price: "" })}
        className="text-foreground inline-flex items-center gap-2 text-sm mt-2"
        variant="link"
      >
        <Plus />
        Add Time Duration
      </Button>
    </div>
  )
}

export default function AddServiceForm() {
  const router = useRouter()
  const handleSubmit = (data: AddServiceFormData) => {
    router.push("/admin/services")
    console.log("Service data:", data)
  }

  return (
    <div>
      <Typography variant="h5" className="font-bold text-foreground mb-4">
        Add Service
      </Typography>

      <div className="bg-background rounded-lg shadow-sm p-6">
        <FormModified
          schema={addServiceSchema}
          onSubmit={handleSubmit}
          defaultValues={{
            serviceTitle: "",
            subServices: [{ duration: "", price: "" }],
          }}
        >
          {({ components, methods }) => (
            <div className="space-y-6">
              <div>
                <Typography
                  variant="p"
                  className="font-semibold text-foreground mb-4"
                >
                  General Info
                </Typography>
                <components.Input
                  name="serviceTitle"
                  placeholder="Open Ear"
                  className="w-1/4"
                />
              </div>

              <SubServicesSection components={components} methods={methods} />

              <div className="flex justify-end gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" className="text-background">
                  Add Service
                </Button>
              </div>
            </div>
          )}
        </FormModified>
      </div>
    </div>
  )
}
