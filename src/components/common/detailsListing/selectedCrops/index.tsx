import { Box, Typography } from '@mui/material';
import SectionHeader from '../../title/TitleHeader';
import { getRandomExtremelyLightColor } from 'src/utils/getColorName';

interface SelectedCropsProps {
  data: any;
  title: string;
}
const SelectedCrops = ({ data, title }: SelectedCropsProps) => {
  return (
    <Box>
      <SectionHeader title={title} />
      <Box sx={{ my: 2 }}>
        {data && data?.length > 0 ? (
          <Box display="flex" sx={{ flexWrap: 'wrap' }}>
            {data?.map((item: any, index: number) => (
              <Typography
                key={index}
                variant="body2"
                mx={1}
                sx={{
                  bgcolor: getRandomExtremelyLightColor(),
                  p: 2,
                  mb: 1,
                  borderRadius: '10px',
                  textTransform: 'capitalize',
                }}
              >
                {item || 'N/A'}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            N/A
          </Typography>
        )}
      </Box>
    </Box>
  );
};
export default SelectedCrops;
