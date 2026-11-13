import { ID, Permission, Role } from 'appwrite'
import { account, storage, appwriteConfig, appwriteConfigured } from './appwrite'

const CONTENT_FILE_ID = 'joseph-emotions-site-content'

export const emptyContent = {
  hero: { image: '', images: [], eyebrow: 'THE ARTIST. THE MUSIC. THE JOURNEY.', title: 'JOSEPH EMOTIONS.', subtitle: 'Music that moves you. Stories that stay with you.' },
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
  const saved = JSON.parse(await response.text())
  const hero = { ...emptyContent.hero, ...(saved.hero || {}) }
  if (!Array.isArray(hero.images)) hero.images = hero.image ? [hero.image] : []
  if (!hero.image && hero.images.length) hero.image = hero.images[0]
  return {
    ...emptyContent,
    ...saved,
    hero,
    profile: { ...emptyContent.profile, ...(saved.profile || {}) },
    socials: { ...emptyContent.socials, ...(saved.socials || {}) }
  }
}

export async function saveSiteContent(content) {
  if (!appwriteConfigured || !appwriteConfig.bucketId) throw new Error('Appwrite project and storage bucket are not configured.')
  // Keep the last published version in memory so a failed replacement can be rolled back.
  const previousContent = await loadSiteContent()
  const file = new File([JSON.stringify(content, null, 2)], 'site-content.json', { type: 'application/json' })
  const previousFile = new File([JSON.stringify(previousContent, null, 2)], 'site-content.json', { type: 'application/json' })
  const permissions = [Permission.read(Role.any()), Permission.update(Role.team(appwriteConfig.adminTeamId)), Permission.delete(Role.team(appwriteConfig.adminTeamId))]
  let hadPreviousFile = true
  try {
    await storage.deleteFile(appwriteConfig.bucketId, CONTENT_FILE_ID)
  } catch (error) {
    if (error.code === 404) hadPreviousFile = false
    else throw error
  }
  try {
    await storage.createFile(appwriteConfig.bucketId, CONTENT_FILE_ID, file, permissions)
  } catch (saveError) {
    if (hadPreviousFile) {
      try {
        await storage.createFile(appwriteConfig.bucketId, CONTENT_FILE_ID, previousFile, permissions)
      } catch (restoreError) {
        throw new Error('The new content could not be saved, and the previous version could not be restored. Please contact support before trying again. Original error: ' + (saveError.message || 'Save failed.'))
      }
    }
    throw saveError
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
