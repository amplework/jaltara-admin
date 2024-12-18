import { Box } from '@mui/system';
import React from 'react';
import { RHFSelectDropdown, RHFTextField } from 'src/components/hook-form';
import { useSelector } from 'src/redux/store';

export const LocationList = [
  { id: 'state', label: 'State', name: 'State', value: 'state' },
  { id: 'district', label: 'District', name: 'District', value: 'district' },
  { id: 'taluk', label: 'Taluk', name: 'Taluk', value: 'taluk' },
  { id: 'village', label: 'Village', name: 'Village', value: 'village' },
];

interface LocationFormProp {
  statusList?: any;
  handleLocationChange?: any;
  handleStatesSelect?: any;
  handleDistrictSelect?: any;
  handleTalukSelect?: any;
  methods?: any;
  state?: any;
  isLoading?: boolean;
  selectLocation?: any;
}
const StateForm = ({
  handleLocationChange,
  methods,
  state,
  selectLocation,
}: LocationFormProp) => {
  const { watch } = methods;

  return (
    <Box
      sx={{
        display: 'grid',
        columnGap: 2,
        rowGap: 2,
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
        p: 2,
      }}
    >
      <RHFSelectDropdown
        name="location"
        label={'Select location'}
        placeholder={'location'}
        value={watch('location')}
        options={selectLocation?.length ? selectLocation : LocationList}
        onChange={handleLocationChange}
        disabled={true}
      />

      <RHFTextField name="name" label={'Name'} placeholder={'Name'} />

    </Box>
  );
};

export default StateForm;
