import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.link.deleteMany()
  await prisma.usuario.deleteMany()
  await prisma.categoria.deleteMany()
  await prisma.configuracao.deleteMany()

  // Admin user
  await prisma.usuario.create({
    data: {
      nome: 'Equipe Comunicação',
      email: 'comunicacao@sicoobaracoop.com.br',
      senhaHash: await bcrypt.hash('aracoop@2024', 10),
    },
  })

  // Default configs
  const configs = [
    { chave: 'cor_primaria', valor: '#00B4A0' },
    { chave: 'ga4_id', valor: '' },
    { chave: 'logo_url', valor: '' },
    { chave: 'bio', valor: 'Cooperativa de crédito feita por pessoas, para pessoas. Acesse nossos serviços e campanhas. 💚' },
    { chave: 'titulo_site', valor: 'Sicoob Aracoop | Links' },
    { chave: 'descricao_site', valor: 'Acesse todos os serviços e campanhas do Sicoob Aracoop' },
  ]

  for (const c of configs) {
    await prisma.configuracao.upsert({ where: { chave: c.chave }, update: {}, create: c })
  }

  // Links
  const links = [
    { titulo: 'Abrir Conta Digital', descricao: 'Seja cooperado em poucos minutos', urlDestino: 'https://sicoobaracoop.com.br/abrir-conta', categoria: 'Conta', icone: 'credit-card', corIcone: '#00B4A0', utmSource: 'pagina_links', utmMedium: 'botao', utmCampaign: 'abertura_conta', utmContent: 'abrir_conta', ordem: 1, ativo: true },
    { titulo: 'Aracoop Delas', descricao: 'Programa de mulheres cooperativistas', urlDestino: 'https://sicoobaracoop.com.br/delas', categoria: 'Programas', icone: 'sparkles', corIcone: '#E84062', utmSource: 'pagina_links', utmMedium: 'botao', utmCampaign: 'aracoop_delas', utmContent: 'banner_principal', ordem: 2, ativo: true },
    { titulo: 'Leilão do Sindicato', descricao: 'Crédito facilitado para o leilão', urlDestino: 'https://sicoobaracoop.com.br/leilao', categoria: 'Crédito', icone: 'gavel', corIcone: '#F59E0B', utmSource: 'pagina_links', utmMedium: 'botao', utmCampaign: 'leilao_sindicato', utmContent: 'leilao', ordem: 3, ativo: true },
    { titulo: 'Crédito Rural & Agro', descricao: 'Linhas para o produtor cooperado', urlDestino: 'https://sicoobaracoop.com.br/agro', categoria: 'Crédito', icone: 'leaf', corIcone: '#16A34A', utmSource: 'pagina_links', utmMedium: 'botao', utmCampaign: 'credito_rural', utmContent: 'credito_rural', ordem: 4, ativo: true },
    { titulo: 'Seguros Sicoob', descricao: 'Proteção para você e seu negócio', urlDestino: 'https://sicoobaracoop.com.br/seguros', categoria: 'Seguros', icone: 'shield', corIcone: '#0F766E', utmSource: 'pagina_links', utmMedium: 'botao', utmCampaign: 'seguros', utmContent: 'seguros', ordem: 5, ativo: true },
    { titulo: 'Consórcio Sicoob', descricao: 'Conquiste seu bem sem juros', urlDestino: 'https://sicoobaracoop.com.br/consorcio', categoria: 'Crédito', icone: 'gift', corIcone: '#3B82F6', utmSource: 'pagina_links', utmMedium: 'botao', utmCampaign: 'consorcio', utmContent: 'consorcio', ordem: 6, ativo: true },
    { titulo: 'WhatsApp Atendimento', descricao: 'Fale com um consultor agora', urlDestino: 'https://wa.me/5500000000000', categoria: 'Atendimento', icone: 'message-circle', corIcone: '#25D366', utmSource: 'pagina_links', utmMedium: 'botao', utmCampaign: 'atendimento', utmContent: 'whatsapp', ordem: 7, ativo: true },
    { titulo: 'Instagram @sicoobaracoop', descricao: 'Siga a gente nas redes sociais', urlDestino: 'https://instagram.com/sicoobaracoop', categoria: 'Atendimento', icone: 'instagram', corIcone: '#E1306C', utmSource: 'pagina_links', utmMedium: 'botao', utmCampaign: 'institucional', utmContent: 'instagram', ordem: 8, ativo: true },
  ]

  for (const link of links) {
    await prisma.link.create({ data: link })
  }

  console.log('✅ Seed concluído!')
  console.log('   Login: comunicacao@sicoobaracoop.com.br')
  console.log('   Senha: aracoop@2024')
}

main().catch(console.error).finally(() => prisma.$disconnect())
