import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import UnifiedVideoMedia from './UnifiedVideoMedia';
import UnifiedImageMedia from './UnifiedImageMedia';

const MediaTestComponent: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Media Components Test
      </Typography>
      
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        1. Valid Video URL
      </Typography>
      <Box sx={{ mb: 4 }}>
        <UnifiedVideoMedia 
          src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" 
          alt="Sample video"
        />
      </Box>
      
      <Typography variant="h6" gutterBottom>
        2. Valid Image URL
      </Typography>
      <Box sx={{ mb: 4 }}>
        <UnifiedImageMedia 
          src="https://sample-videos.com/img/Sample-png-image-100kb.png" 
          alt="Sample image"
        />
      </Box>
      
      <Typography variant="h6" gutterBottom>
        3. Missing File (Known Pattern)
      </Typography>
      <Box sx={{ mb: 4 }}>
        <UnifiedVideoMedia 
          src="http://localhost:8000/uploads/talkcart/file_1760473798652_vm6onvgccj.mp4" 
          alt="Missing video file"
        />
      </Box>
      
      <Typography variant="h6" gutterBottom>
        4. Invalid URL
      </Typography>
      <Box sx={{ mb: 4 }}>
        <UnifiedImageMedia 
          src="invalid-url" 
          alt="Invalid image URL"
        />
      </Box>
      
      <Typography variant="h6" gutterBottom>
        5. Duplicate Path URL
      </Typography>
      <Box sx={{ mb: 4 }}>
        <UnifiedVideoMedia 
          src="http://localhost:8000/uploads/talkcart/talkcart/sample-video.mp4" 
          alt="Duplicate path video"
        />
      </Box>
    </Container>
  );
};

export default MediaTestComponent;