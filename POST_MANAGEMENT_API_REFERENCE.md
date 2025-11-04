# Post Management API Reference

## Quick Reference

### 1. Delete Post
```
DELETE /api/posts/:postId
Authorization: Required
```

**Response**:
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

### 2. Archive Post
```
PATCH /api/posts/:postId/archive
Authorization: Required
Content-Type: application/json

Body:
{
  "isArchived": true  // or false to unarchive
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "postId": "507f1f77bcf86cd799439011",
    "isArchived": true
  },
  "message": "Post archived successfully"
}
```

---

### 3. Hide Like Count
```
PATCH /api/posts/:postId/hide-likes
Authorization: Required
Content-Type: application/json

Body:
{
  "hideLikeCount": true  // or false to show
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "postId": "507f1f77bcf86cd799439011",
    "hideLikeCount": true
  },
  "message": "Like count hidden successfully"
}
```

---

### 4. Hide Comments
```
PATCH /api/posts/:postId/hide-comments
Authorization: Required
Content-Type: application/json

Body:
{
  "hideComments": true  // or false to show
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "postId": "507f1f77bcf86cd799439011",
    "hideComments": true
  },
  "message": "Comments hidden successfully"
}
```

---

### 5. Update Post (Enhanced)
```
PUT /api/posts/:postId
Authorization: Required
Content-Type: application/json

Body:
{
  "content": "Updated content",
  "hashtags": ["tag1", "tag2"],
  "location": "New York",
  "privacy": "public",
  "isArchived": false,
  "hideLikeCount": false,
  "hideComments": false
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "507f1f77bcf86cd799439011",
      "content": "Updated content",
      "isArchived": false,
      "hideLikeCount": false,
      "hideComments": false,
      ...
    }
  },
  "message": "Post updated successfully"
}
```

---

## Frontend API Usage

### JavaScript/TypeScript Examples

```typescript
import { api } from '@/lib/api';

// Archive a post
await api.posts.archive('postId', true);

// Unarchive a post
await api.posts.archive('postId', false);

// Hide like count
await api.posts.hideLikes('postId', true);

// Show like count
await api.posts.hideLikes('postId', false);

// Hide comments
await api.posts.hideComments('postId', true);

// Show comments
await api.posts.hideComments('postId', false);

// Delete post
await api.posts.delete('postId');

// Update post with management fields
await api.posts.update('postId', {
  content: 'New content',
  isArchived: false,
  hideLikeCount: false,
  hideComments: false
});
```

---

## Error Responses

### 404 - Post Not Found
```json
{
  "success": false,
  "error": "Post not found"
}
```

### 403 - Forbidden (Not Author)
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "You can only archive your own posts"
}
```

### 400 - Invalid Input
```json
{
  "success": false,
  "error": "isArchived must be a boolean"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "error": "Failed to archive post",
  "message": "Error details..."
}
```

---

## Authorization

All endpoints require:
1. Valid JWT token in `Authorization` header
2. User must be the post author
3. Post must exist and be active

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (no token) |
| 403 | Forbidden (not author) |
| 404 | Post not found |
| 500 | Server error |

---

## Rate Limiting

No specific rate limits on these endpoints, but general API rate limits apply.

---

## Caching

- Responses are not cached
- UI updates immediately after successful operation
- Toast notifications provide user feedback

---

## Notes

- All operations are reversible (except delete)
- Changes are persisted to database immediately
- Real-time updates via WebSocket (if enabled)
- Archived posts are still visible to author
- Hidden likes/comments are still stored, just not displayed

