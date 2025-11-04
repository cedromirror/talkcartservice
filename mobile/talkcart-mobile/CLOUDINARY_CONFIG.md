# Cloudinary Configuration for TalkCart Mobile App

## Configuration Overview

The TalkCart mobile app is configured to use Cloudinary with the cloud name `dftpdqd4k` for media storage and delivery.

## Environment Variables

The following environment variables are used for Cloudinary configuration in the mobile app:

```bash
# Cloudinary Configuration
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=dftpdqd4k
```

This matches the backend Cloudinary configuration in `backend/.env`:

```bash
CLOUDINARY_CLOUD_NAME=dftpdqd4k
CLOUDINARY_API_KEY=234555435129216
CLOUDINARY_API_SECRET=m6aCoZfdNViOhHm7nkKQ7qWGdNA
```

## URL Structure

Cloudinary URLs follow this pattern:

```
https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{transformations}/{public_id}
```

For example:
- Image: `https://res.cloudinary.com/dftpdqd4k/image/upload/talkcart/sample.jpg`
- Video: `https://res.cloudinary.com/dftpdqd4k/video/upload/talkcart/sample.mp4`

## Media Handling in the Mobile App

The mobile app uses the `src/lib/media.ts` module for handling Cloudinary media:

1. **Image URLs**: Generated with `getCloudinaryImageUrl()`
2. **Video URLs**: Generated with `getCloudinaryVideoUrl()`
3. **Video Thumbnails**: Generated with `getVideoThumbnailUrl()`
4. **Media Upload**: Handled by `uploadMedia()` which sends files to the backend API
5. **Media Deletion**: Handled by `deleteMedia()` which calls the backend API

## Folder Structure

All media is organized in the `talkcart` folder on Cloudinary:

```
talkcart/
├── marketplace/
├── posts/
├── profiles/
└── videos/
```

## Transformations

Common transformations used:
- Quality: `q_auto` for automatic quality optimization
- Format: `f_auto` for automatic format selection
- Crop: `c_fill` for filling dimensions while maintaining aspect ratio
- Width/Height: Specified as needed for different UI components

## Testing Configuration

To verify the Cloudinary configuration is correct:

1. Run the test script:
   ```bash
   node scripts/test-cloudinary-config.js
   ```

2. Check that the output shows:
   ```
   Cloud Name: dftpdqd4k
   Configuration Status: ✅ CORRECT
   ```

## Troubleshooting

If media is not loading correctly:

1. Verify the Cloudinary cloud name in `.env` matches `dftpdqd4k`
2. Ensure the backend is properly configured with Cloudinary credentials
3. Check that media files exist in the Cloudinary account
4. Verify network connectivity between the mobile app and Cloudinary

## Security Notes

- The mobile app only needs the cloud name for generating URLs
- API keys and secrets are stored only on the backend
- All media operations go through the backend API for security