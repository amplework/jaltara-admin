import { Grid } from '@mui/material';
import SevekSummary from 'src/sections/@dashboard/user/list/SevekPitsCount';

interface SummaryCardsProps{
     data: any[];
      isLoading: boolean 
}

export default function SummaryCards({ data, isLoading }:SummaryCardsProps) {
  return (
    <Grid container spacing={3} pb={2}>
      {data.map((item, index) => (
        <Grid item xs={12} md={4} key={index}>
          <SevekSummary title={item.title} total={item.total} isLoading={isLoading} />
        </Grid>
      ))}
    </Grid>
  );
}