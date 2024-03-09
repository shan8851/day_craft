import { httpBatchLink } from "@trpc/client"

import { appRouter } from "@/server"
import { createCallerFactory } from "@trpc/server";

export const serverClient = appRouter.createCaller({
  links: [httpBatchLink({ url: '/api/trpc' })]
})
