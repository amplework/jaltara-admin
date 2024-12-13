import { Box, Grid } from '@mui/material';
import Image from 'src/components/Image';
import noImage from 'src/assets/images/noImage.jpg';

const ImageCard = ({ src }: { src: string | null }) => {
  return (
        <Box
          sx={{
            width: 300,
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          <Image
            src={src ? src : noImage}
            alt={src ? 'Uploaded Image' : 'No Image Available'}
            sx={{
              width: '90%',
              height: 'auto',
              borderRadius:"10PX",
              objectFit: 'cover',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
        </Box>
  );
};
export default ImageCard;
