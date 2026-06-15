import { prisma } from './prisma'

export async function getConfigs(): Promise<Record<string, string>> {
  try {
    const configs = await prisma.configuracao.findMany()
    return Object.fromEntries(configs.map((c) => [c.chave, c.valor]))
  } catch {
    return {}
  }
}

export async function getConfig(chave: string, fallback = ''): Promise<string> {
  try {
    const c = await prisma.configuracao.findUnique({ where: { chave } })
    return c?.valor ?? fallback
  } catch {
    return fallback
  }
}
