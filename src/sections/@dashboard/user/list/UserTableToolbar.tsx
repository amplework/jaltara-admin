import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  filterName: string;
  filterVillage: string;
  onFilterName: (value: string) => void;
  onFilterVillage: (value: string) => void;
  onSearch:VoidFunction;
};

export default function UserTableToolbar({
  filterName,
  filterVillage,
  onFilterName,
  onFilterVillage,
  onSearch,
}: Props) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="User Name..."
      />
      <TextField
        fullWidth
        value={filterVillage}
        onChange={(event) => onFilterVillage(event.target.value)}
        placeholder="Village Name..."
      />
      <Button variant="contained" fullWidth startIcon={<Iconify icon={'mdi:search'} />} onClick={onSearch} >
        Search
      </Button>
    </Stack>
  );
}
