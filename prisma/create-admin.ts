import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'comunicacao@sicoobaracoop.com.br'
  const senha = 'aracoop@2024'

  await prisma.usuario.upsert({
    where: { email },
    update: { senhaHash: await bcrypt.hash(senha, 10) },
    create: {
      nome: 'Equipe Comunicação',
      email,
      senhaHash: await bcrypt.hash(senha, 10),
    },
  })

  console.log('✅ Usuário admin criado/atualizado!')
  console.log('   Email:', email)
  console.log('   Senha:', senha)
}

main().catch(console.error).finally(() => prisma.$disconnect())
