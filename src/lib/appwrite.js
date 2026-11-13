import { Client, Databases, Storage, Account, Teams } from 'appwrite'

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID

export const appwriteConfigured = Boolean(endpoint && projectId)

const client = new Client()
if (appwriteConfigured) client.setEndpoint(endpoint).setProject(projectId)

export const account = appwriteConfigured ? new Account(client) : null
export const teams = appwriteConfigured ? new Teams(client) : null
export const databases = appwriteConfigured ? new Databases(client) : null
export const storage = appwriteConfigured ? new Storage(client) : null

export const appwriteConfig = {
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
  adminTeamId: import.meta.env.VITE_APPWRITE_ADMIN_TEAM_ID
}

export async function verifyStudioAdmin() {
  if (!appwriteConfig.adminTeamId) throw new Error('Studio administrator team is not configured.')
  // Identify the signed-in account first, then verify that exact user has a confirmed
  // membership. A confirmed membership belonging to somebody else is not sufficient.
  const current = await account.get()
  const memberships = await teams.listMemberships({ teamId: appwriteConfig.adminTeamId })
  const allowed = memberships.memberships.some(item => item.confirm && item.userId === current.$id)
  if (!allowed) {
    await account.deleteSession('current')
    throw new Error('This account is not authorized to access the artist studio.')
  }
  return current
}
