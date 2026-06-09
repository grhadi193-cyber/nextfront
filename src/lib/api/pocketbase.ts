import PocketBase from 'pocketbase'

const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL ?? 'http://localhost:8090')

export default pb

export const getBanners = () =>
  pb.collection('banners').getFullList({ sort: 'order' })

export const getPartners = () =>
  pb.collection('partners').getFullList({ sort: 'order' })

export const getProductImages = (productId: string | number) =>
  pb.collection('products_ui').getFullList({ filter: `product_id="${productId}"` })

export const getBlogs = (page = 1, perPage = 9) =>
  pb.collection('blogs').getList(page, perPage, {
    sort: '-created', filter: 'is_published=true',
  })

export const getBlog = (slug: string) =>
  pb.collection('blogs').getFirstListItem(`slug="${slug}"`)

export const getSiteConfig = () =>
  pb.collection('site_config').getFirstListItem('')

export const getPage = (slug: string) =>
  pb.collection('pages').getFirstListItem(`slug="${slug}"`)

/**
 * URL تصویر PocketBase
 * record باید collectionId یا collectionName داشته باشه.
 * PocketBase SDK همیشه این فیلدها رو توی RecordModel برمیگردونه.
 */
export function pbImageUrl(record: any, filename: string): string {
  if (!filename) return ''
  const baseUrl = process.env.NEXT_PUBLIC_PB_URL ?? 'http://localhost:8090'

  // collectionId اولویت داره، اگه نبود از collectionName استفاده کن
  const collection = record.collectionId ?? record.collectionName ?? ''
  if (!collection) {
    console.warn('[pbImageUrl] record has no collectionId or collectionName:', record)
    return ''
  }

  return `${baseUrl}/api/files/${collection}/${record.id}/${filename}`
}

/**
 * URL مستقیم بدون نیاز به record — وقتی collection name و record id رو داری
 */
export function pbDirectUrl(collectionName: string, recordId: string, filename: string): string {
  if (!filename || !collectionName || !recordId) return ''
  const baseUrl = process.env.NEXT_PUBLIC_PB_URL ?? 'http://localhost:8090'
  return `${baseUrl}/api/files/${collectionName}/${recordId}/${filename}`
}
