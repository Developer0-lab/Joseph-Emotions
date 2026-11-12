import { Client, Databases, Storage, Account } from 'appwrite'

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID

export const appwriteConfigured = Boolean(endpoint && projectId)

const client = new Client()
if (appwriteConfigured) client.setEndpoint(endpoint).setProject(projectId)

export const account = appwriteConfigured ? new Account(client) : null
export const databases = appwriteConfigured ? new Databases(client) : null
export const storage = appwriteConfigured ? new Storage(client) : null

export const appwriteConfig = {
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID
}
