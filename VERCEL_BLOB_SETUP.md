# 🗂️ Vercel Blob Setup Guide

## 🔑 **Required Environment Variables**

Add these to your Vercel project dashboard:

```env
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token_here"
```

## 📋 **How to Get Your Blob Token**

1. **Go to [vercel.com/dashboard](https://vercel.com/dashboard)**
2. **Select your project**
3. **Go to Storage tab**
4. **Click "Create Blob Store"**
5. **Copy the `BLOB_READ_WRITE_TOKEN`**

## 🌍 **Environment Setup**

### **Production (Vercel)**
- ✅ Uses Vercel Blob for image storage
- ✅ Images stored in Vercel's global CDN
- ✅ Automatic optimization and caching

### **Development (Local)**
- ✅ Uses local `/public/uploads` directory
- ✅ No external dependencies
- ✅ Easy testing and development

## 🚀 **Benefits of Vercel Blob**

- **Global CDN**: Fast image delivery worldwide
- **Automatic Optimization**: Images optimized automatically
- **Scalable**: Handles unlimited uploads
- **Secure**: Built-in security and access control
- **Cost-Effective**: Pay only for what you use

## 📁 **File Structure**

```
uploads/
├── herb-slug-1/
│   ├── image1.jpg
│   └── image2.png
└── herb-slug-2/
    └── image3.webp
```

## 🔧 **API Endpoints Updated**

- ✅ `POST /api/herbs/[slug]/images` - Upload images
- ✅ `DELETE /api/herbs/[slug]/images/[id]` - Delete images
- ✅ `PATCH /api/herbs/[slug]/images/[id]` - Update image metadata

## 🧪 **Testing**

1. **Local Development**: Images save to `/public/uploads`
2. **Production**: Images upload to Vercel Blob
3. **Automatic Fallback**: App works in both environments

---

**Your app now supports both local development and production Vercel Blob storage!** 🎉
