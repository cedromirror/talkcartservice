# Cloudinary Quick Reference Card

## ✅ Status: FULLY CONFIGURED AND WORKING

---

## Credentials

```env
CLOUDINARY_CLOUD_NAME=dftpdqd4k
CLOUDINARY_API_KEY=234555435129216
CLOUDINARY_API_SECRET=m6aCoZfdNViOhHm7nkKQ7qWGdNA
```

**Location:** `backend/.env`

---

## Upload Endpoint

```
POST /api/media/upload/single
Authorization: Bearer {token}
Content-Type: multipart/form-data
Field: file
```

---

## URL Patterns

### Images
```
https://res.cloudinary.com/dftpdqd4k/image/upload/v{version}/talkcart/{filename}.{ext}
```

### Videos
```
https://res.cloudinary.com/dftpdqd4k/video/upload/v{version}/talkcart/{filename}.{ext}
```

### Video Thumbnails
```
https://res.cloudinary.com/dftpdqd4k/video/upload/w_400,h_300,c_fill,q_auto,f_jpg/talkcart/{filename}.jpg
```

---

## Frontend Usage

### Upload File
```typescript
import { uploadFile } from '@/services/mediaApi';

const response = await uploadFile(file);
const { public_id, secure_url, resource_type } = response.data;
```

### Create Image Post
```typescript
const postData = {
  content: "My post content",
  type: "image",
  media: [{
    public_id: imageData.public_id,
    secure_url: imageData.secure_url,
    url: imageData.url,
    resource_type: "image",
    format: imageData.format,
    bytes: imageData.bytes,
    width: imageData.width,
    height: imageData.height
  }],
  privacy: "public"
};

await api.posts.create(postData);
```

### Create Video Post
```typescript
const postData = {
  content: "My video post",
  type: "video",
  media: [{
    public_id: videoData.public_id,
    secure_url: videoData.secure_url,
    url: videoData.url,
    resource_type: "video",
    format: videoData.format,
    bytes: videoData.bytes,
    width: videoData.width,
    height: videoData.height,
    duration: videoData.duration,
    thumbnail_url: `https://res.cloudinary.com/dftpdqd4k/video/upload/w_400,h_300,c_fill,q_auto,f_jpg/${videoData.public_id}.jpg`
  }],
  privacy: "public"
};

await api.posts.create(postData);
```

---

## Testing

### Test Connection
```bash
cd backend
node test-cloudinary-upload.js
```

### Test Post Flow
```bash
cd backend
node test-post-media-flow.js
```

---

## Configuration Files

### Backend
- `backend/.env` - Cloudinary credentials
- `backend/config/cloudinary.js` - Upload configuration
- `backend/routes/media.js` - Upload endpoints

### Frontend
- `frontend/.env.local` - Cloud name
- `frontend/src/services/mediaApi.ts` - Upload functions
- `frontend/src/lib/cloudinary.ts` - URL helpers

---

## Storage Info

- **Folder:** `talkcart/`
- **Max File Size:** 200 MB
- **Allowed Formats:** jpg, jpeg, png, gif, webp, mp4, webm, mov, avi
- **Resource Type:** Auto-detect (image/video)

---

## Common Operations

### Get Video Thumbnail
```javascript
const thumbnailUrl = `https://res.cloudinary.com/dftpdqd4k/video/upload/w_400,h_300,c_fill,q_auto,f_jpg/${public_id}.jpg`;
```

### Optimize Image
```javascript
const optimizedUrl = `https://res.cloudinary.com/dftpdqd4k/image/upload/w_800,q_auto,f_auto/${public_id}.jpg`;
```

### Responsive Image
```javascript
const responsiveUrl = `https://res.cloudinary.com/dftpdqd4k/image/upload/w_auto,c_scale,dpr_auto/${public_id}.jpg`;
```

---

## Verification Checklist

- [x] Cloudinary credentials configured
- [x] Connection successful
- [x] Image uploads working
- [x] Video uploads working
- [x] Correct URL generation
- [x] Database schema validates URLs
- [x] Frontend integration working
- [x] Tests passing

---

## Support

**Documentation:** See `CLOUDINARY_IMPLEMENTATION_GUIDE.md` for detailed information  
**Verification Report:** See `CLOUDINARY_SETUP_VERIFICATION.md` for test results

---

**Last Updated:** October 25, 2025  
**Status:** ✅ Production Ready

