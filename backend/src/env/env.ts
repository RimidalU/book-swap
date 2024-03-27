import { z } from 'zod'

export const envSchema = z.object({
  API_PORT: z.coerce.number().optional().default(3000),
  API_HOST: z.coerce.string().min(1).optional().default('http://localhost:'),
  TYPEORM_CONNECTION: z.coerce.string().min(3),
  TYPEORM_DATABASE: z.coerce.string().min(1),
  TYPEORM_USER: z.coerce.string().min(1),
  TYPEORM_PASSWORD: z.coerce.string().min(1),
  TYPEORM_PORT: z.coerce.number().min(4),
  TYPEORM_HOST: z.coerce.string().min(1).optional().default('localhost'),
})
export type Env = z.infer<typeof envSchema>
