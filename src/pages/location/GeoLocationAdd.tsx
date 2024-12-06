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
}
const GeoLocationAdd = ({
  statusList,
  handleTalukSelect,
  handleDistrictSelect,
  handleLocationChange,
  handleStatesSelect,
  methods,
  state,
}: LocationFormProp) => {
  const { statesList, districtList, talukList } = useSelector((state) => state.user);
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
        options={LocationList}
        onChange={handleLocationChange}
        disabled={state?.id ? true : false}
      />

      {['district', 'taluk', 'village']?.includes(watch('location')) && (
        <RHFSelectDropdown
          name="selectStates"
          label={'Select States'}
          placeholder={'States'}
          options={statesList||[]}
          onChange={handleStatesSelect}
        />
      )}

      {['taluk', 'village']?.includes(watch('location')) &&
        watch('selectStates') &&
        districtList?.childEntities?.length && (
          <RHFSelectDropdown
            name="selectDistrict"
            label={'Select District'}
            placeholder={'District'}
            options={districtList?.childEntities||[]}
            defaultMessage="Please Select State"
            onChange={handleDistrictSelect}
          />
        )}
      {['village']?.includes(watch('location')) &&
        watch('selectStates') &&
        watch('selectDistrict') && (
          <RHFSelectDropdown
            name="selectTaluk"
            label={'Select Taluk'}
            placeholder={'Taluk'}
            options={talukList?.childEntities || []}
            defaultMessage="Please Select District"
            onChange={handleTalukSelect}
          />
        )}

      <RHFTextField name="name" label={'Name'} placeholder={'Name'} />
    </Box>
  );
};

export default GeoLocationAdd;
