import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://adaptivesensing.io'

  const routes = [
    '',
    '/about',
    '/services',
    '/case-studies',
    '/interactive-tools/uas-plume-simulator',
    '/interactive-tools/oil-spill-simulator',
    '/dissolved-gas-calculators',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...routes]
}
