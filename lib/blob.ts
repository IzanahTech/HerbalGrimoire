import { put, del, list } from '@vercel/blob'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

export interface BlobUploadResult {
  url: string
  pathname: string
  size: number
  uploadedAt: Date
}

export interface LocalUploadResult {
  url: string
  pathname: string
  size: number
  uploadedAt: Date
}

/**
 * Upload a file to Vercel Blob (production) or local storage (development)
 */
export async function uploadImage(
  file: File,
  filename: string,
  alt?: string
): Promise<BlobUploadResult | LocalUploadResult> {
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    // Use Vercel Blob in production
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN
    })
    
    return {
      url: blob.url,
      pathname: blob.pathname,
      size: file.size,
      uploadedAt: new Date()
    }
  } else {
    // Use local storage in development
    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const filePath = path.join(uploadDir, filename)
    
    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true })
    
    // Write file locally
    await writeFile(filePath, buffer)
    
    return {
      url: `/uploads/${filename}`,
      pathname: `/uploads/${filename}`,
      size: buffer.length,
      uploadedAt: new Date()
    }
  }
}

/**
 * Delete a file from Vercel Blob (production) or local storage (development)
 */
export async function deleteImage(url: string): Promise<boolean> {
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    try {
      // Extract pathname from URL for Vercel Blob
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      
      // Delete from Vercel Blob
      await del(pathname)
      return true
    } catch (error) {
      console.error('Failed to delete from Vercel Blob:', error)
      return false
    }
  } else {
    try {
      // Delete from local storage
      if (url.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), 'public', url)
        await unlink(filePath).catch(() => {})
      }
      return true
    } catch (error) {
      console.error('Failed to delete local file:', error)
      return false
    }
  }
}

/**
 * List all blobs in a directory (Vercel Blob only)
 */
export async function listBlobs(prefix?: string): Promise<Array<{ url: string; pathname: string; size: number }>> {
  if (process.env.NODE_ENV !== 'production') {
    // Local development - return empty array
    return []
  }
  
  try {
    const { blobs } = await list({ 
      prefix,
      token: process.env.BLOB_READ_WRITE_TOKEN 
    })
    
    return blobs.map(blob => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size || 0
    }))
  } catch (error) {
    console.error('Failed to list blobs:', error)
    return []
  }
}

/**
 * Generate a unique filename for uploads
 */
export function generateFilename(originalName: string, herbSlug: string): string {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const extension = path.extname(originalName)
  const baseName = path.basename(originalName, extension)
  
  return `${herbSlug}-${baseName}-${timestamp}-${randomSuffix}${extension}`
}
