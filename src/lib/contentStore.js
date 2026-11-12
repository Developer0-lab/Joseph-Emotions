import { ID, Permission, Role } from 'appwrite'
import { account, storage, appwriteConfig, appwriteConfigured } from './appwrite'

const CONTENT_FILE_ID = 'joseph-emotions-site-content'

export const emptyContent = {
  hero: { image: '', eyebrow: 'THE ARTIST. THE MUSIC. THE JOURNEY.', title: 'JOSEPH EMOTIONS.', subtitle: 'Music that moves you. Stories that stay with you.' },
  profile: { portrait: '', biography: '' },
  music: [],
  videos: [],
  gallery: [],
  updates: [],
  socials: { instagram: '', tiktok: '', youtube: '', spotify: '', appleMusic: '' }
}

export async function loadSiteContent() {
  if (!appwriteConfigured || !appwriteConfig.bucketId) throw new Error('Appwrite project and storage bucket are not configured.')
  const url = storage.getFileDownload(appwriteConfig.bucketId, CONTENT_FILE_ID)
  const response = await fetch(url)
  if (!response.ok) {
    if (response.status === 404) return emptyContent
    throw new Error('Could not load saved website content.')
  }
  return { ...emptyContent, ...JSON.parse(await response.text()) }
}

export async function saveSiteContent(content) {
  if (!appwriteConfigured || !appwriteConfig.bucketId) throw new Error('Appwrite project and storage bucket are not configured.')
  const user = await account.get()
  const file = new File([JSON.stringify(content, null, 2)], 'site-content.json', { type: 'application/json' })
  const permissions = [Permission.read(Role.any()), Permission.update(Role.user(user.$id)), Permission.delete(Role.user(user.$id))]
  try {
    await storage.updateFile(appwriteConfig.bucketId, CONTENT_FILE_ID, file, permissions)
  } catch (error) {
    if (error.code !== 404) throw error
    await storage.createFile(appwriteConfig.bucketId, CONTENT_FILE_ID, file, permissions)
  }
}

export async function uploadSiteMedia(file, category = 'media') {
  if (!appwriteConfigured || !appwriteConfig.bucketId) throw new Error('Appwrite project and storage bucket are not configured.')
  const user = await account.get()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const fileId = ID.unique()
  await storage.createFile(appwriteConfig.bucketId, fileId, file, [
    Permission.read(Role.any()),
    Permission.update(Role.user(user.$id)),
    Permission.delete(Role.user(user.$id))
  ])
  return {
    id: fileId,
    name: file.name,
    type: file.type,
    category,
    url: storage.getFileView(appwriteConfig.bucketId, fileId).toString()
  }
}
