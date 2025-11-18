import { createAuthClient } from "better-auth/client"
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins"
import { env } from "@/env"

const auth = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  fetchOptions: {
    credentials: "include",
  },

  plugins: [
    adminClient(),
    inferAdditionalFields({
      user: {
        onboardingStage: {
          type: "string",
          required: false,
        },
      },
    }),
  ],
})
export default auth