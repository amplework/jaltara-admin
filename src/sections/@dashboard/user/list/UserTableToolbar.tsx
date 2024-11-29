import { Stack, InputAdornment, TextField, MenuItem, Button, Select } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { InputLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { statusList } from 'src/pages/masterData/cropsChallanges/ChallangesList';

// ----------------------------------------------------------------------

type Props = {
  filterName: string;
  filterVillage: string;
  onFilterName: (value: string) => void;
  onFilterVillage?: any;
  onSearch: VoidFunction;
  placeholderText: string;
  placeholderTextSecond: string;
  challenges?: boolean;
  pits?: boolean;
  stagesName?: any;
  onChange?: any;
  state?: any;
  onChallengesChange?: any;
};

export default function UserTableToolbar({
  filterName,
  filterVillage,
  onFilterName,
  onFilterVillage,
  onSearch,
  placeholderText,
  placeholderTextSecond,
  pits,
  stagesName,
  onChange,
  state,
  challenges,
}: Props) {
  console.log('state',state);
  
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 1 }}>
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder={placeholderText}
      />
      {!challenges && (
        <TextField
          fullWidth
          value={filterVillage}
          onChange={(event) => onFilterVillage(event.target.value)}
          placeholder={placeholderTextSecond}
        />
      )}

      {pits && (
        <>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Please select stages</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="please select stages"
              value={state.selectStages || ''}
              placeholder="please select stages"
              fullWidth
              onChange={(event: any) => onChange(event.target.value)}
            >
              <MenuItem value="" disabled>
                Please select stages
              </MenuItem>
              {stagesName?.map((stage: any) => (
                <MenuItem key={stage.id} value={stage.value}>
                  {stage.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
      
      {challenges && (
        <>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Please select status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="please select status"
              value={state.filterStatus || ''}
              placeholder="please select status"
              fullWidth
              onChange={(event: any) => onChange(event.target.value)}
            >
              <MenuItem value="" disabled>
                Please select status
              </MenuItem>
              {statusList?.map((stage: any) => (
                <MenuItem key={stage.id} value={stage.value}>
                  {stage.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}

      <Button
        variant="contained"
        fullWidth
        startIcon={<Iconify icon={'mdi:search'} />}
        onClick={onSearch}
      >
        Search
      </Button>
    </Stack>
  );
}
