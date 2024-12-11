import { Box, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import React from 'react';
import ReactPlayer from 'react-player';

type VideoPlayerProps = {
  item?: any;
};
export const VideoPlayer = ({ item }: VideoPlayerProps) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <ReactPlayer
        url={item?.url}
        controls
        light={item?.thumbnail} // Thumbnail
        width="300px"
        height="250px"
        playing={true} // Prevent autoplay
        playIcon={
          <div
            style={{
              width: '60px',
              height: '60px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="white"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        } // Custom play button over thumbnail
        style={{
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" sx={{ textTransform:"capitalize" }}>
          {item?.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary',textTransform:"capitalize" }}>
          {item?.status}
        </Typography>
      </CardContent>
    </Card>
  );
};
