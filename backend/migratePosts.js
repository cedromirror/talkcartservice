// Migration script to check and update existing posts with proper Cloudinary URLs
const mongoose = require('mongoose');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Load environment variables
require('dotenv').config();

// Import the models
const Post = require('./models/Post');
const User = require('./models/User');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
  console.log('Connected to MongoDB');
  
  try {
    // Get all posts with media that have local URLs
    const posts = await Post.find({ 
      'media.0': { $exists: true },
      'media.secure_url': { $regex: 'localhost:8000/uploads/' }
    })
    .populate('author', 'username displayName')
    .lean();
    
    console.log(`Found ${posts.length} posts with local media URLs:`);
    
    // Update each post
    for (const post of posts) {
      console.log(`\n--- Processing Post ${post._id} ---`);
      console.log(`Author: ${post.author?.displayName || post.author?.username}`);
      console.log(`Content: ${post.content?.substring(0, 50)}${post.content?.length > 50 ? '...' : ''}`);
      
      let updatedMedia = [];
      let hasChanges = false;
      
      for (const media of post.media) {
        console.log(`  Media: ${media.resource_type} - ${media.secure_url}`);
        
        // Check if this is a local URL that should be a Cloudinary URL
        if (media.secure_url && media.secure_url.includes('localhost:8000/uploads/')) {
          // Extract the filename from the local URL
          const urlParts = media.secure_url.split('/');
          const filename = urlParts[urlParts.length - 1];
          const publicId = `talkcart/${filename}`;
          
          try {
            // Check if the file exists in Cloudinary
            const result = await cloudinary.api.resource(publicId);
            console.log(`    ✅ File exists in Cloudinary: ${result.secure_url}`);
            
            // Update to use the real Cloudinary URL
            updatedMedia.push({
              ...media,
              secure_url: result.secure_url,
              url: result.url,
              public_id: result.public_id
            });
            
            hasChanges = true;
          } catch (error) {
            // File doesn't exist in Cloudinary, keep the local URL for now
            // but log that it's missing
            console.log(`    ⚠️  File not found in Cloudinary, keeping local URL`);
            console.log(`    Error: ${error.message}`);
            updatedMedia.push(media);
          }
        } else {
          updatedMedia.push(media);
        }
      }
      
      // Update the post if there were changes
      if (hasChanges) {
        await Post.findByIdAndUpdate(post._id, { media: updatedMedia });
        console.log(`  ✅ Post updated successfully`);
      } else {
        console.log(`  ℹ️  No changes needed`);
      }
    }
    
    console.log('\n✅ Migration completed!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error during migration:', error);
    mongoose.connection.close();
  }
});