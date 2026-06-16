export function normalizeUrl(urlDestino: string): string {
  if (!urlDestino) return urlDestino
  const trimmed = urlDestino.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function buildUtmUrl(
  urlDestino: string,
  params: {
    utmSource?: string | null
    utmMedium?: string | null
    utmCampaign?: string | null
    utmContent?: string | null
  }
): string {
  try {
    const url = new URL(normalizeUrl(urlDestino))
    if (params.utmSource) url.searchParams.set('utm_source', params.utmSource)
    if (params.utmMedium) url.searchParams.set('utm_medium', params.utmMedium)
    if (params.utmCampaign) url.searchParams.set('utm_campaign', params.utmCampaign)
    if (params.utmContent) url.searchParams.set('utm_content', params.utmContent)
    return url.toString()
  } catch {
    return normalizeUrl(urlDestino)
  }
}
