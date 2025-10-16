# Running the TalkCart Application

## Prerequisites
- Node.js v18 or higher
- MongoDB database
- Cloudinary account (optional, for media storage)

## Installation

1. Install dependencies for the frontend:
```bash
cd frontend
npm install
```

2. Install dependencies for the backend:
```bash
cd backend
npm install
```

## Environment Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server configuration
PORT=8000
NODE_ENV=development

# Database configuration
MONGODB_URI=mongodb://localhost:27017/talkcart

# JWT configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# Cloudinary configuration (optional)
CLOUDINARY_ENABLED=false
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Upload configuration
UPLOAD_MAX_FILE_SIZE_MB=200
```

## Running the Application

### Backend Server
From the `backend` directory:
```bash
npm run dev
```

This will start the backend server on `http://localhost:8000`.

### Frontend Application
From the `frontend` directory:
```bash
npm run dev
```

This will start the frontend application on `http://localhost:4000`.

## Testing Video Upload and Rendering

1. Navigate to the frontend application at `http://localhost:4000`
2. Create an account or log in
3. Navigate to the video upload section
4. Select a video file (MP4, WebM, MOV, etc.)
5. Add a title and description
6. Upload the video
7. The video should now render correctly in the post feed without the "Video not available" error

## Troubleshooting

### Video Not Rendering
If videos are still not rendering correctly:

1. Check the browser console for error messages
2. Verify that the backend is running and accessible
3. Confirm that the media file was uploaded successfully
4. Check that the URL normalization is working by examining network requests

### Duplicate Path Issues
If you see URLs with `/uploads/talkcart/talkcart/` patterns:

1. The fixes we implemented should automatically resolve these
2. Clear your browser cache and refresh the page
3. If the issue persists, check the backend logs for URL generation issues

### Local Development URLs
For local development, ensure that:
1. The backend is running on port 8000
2. The frontend is configured to use the correct API URL
3. CORS is properly configured in the backend

## Video Rendering Fix Details

The video rendering issue was caused by duplicate path segments in media URLs. Our fix includes:

1. **URL Normalization**: Automatically detects and fixes duplicate `/uploads/talkcart/talkcart/` paths
2. **Enhanced Validation**: Properly validates media URLs before rendering
3. **Error Handling**: Provides meaningful error messages instead of debug messages
4. **Cross-Environment Compatibility**: Works correctly in both development and production environments

## Additional Resources

- [Video Rendering Fix Summary](VIDEO_RENDERING_FIX_SUMMARY.md)
- [Backend API Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)