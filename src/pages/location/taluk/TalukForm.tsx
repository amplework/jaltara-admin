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
}
const TalukForm = ({
  statusList,
  handleTalukSelect,
  handleDistrictSelect,
  handleLocationChange,
  handleStatesSelect,
  methods,
  state,
  isLoading,
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
        value={watch('location')}
        options={LocationList}
        onChange={handleLocationChange}
        disabled={true}
      />

      {['district', 'taluk', 'village']?.includes(watch('location')) && (
        <RHFSelectDropdown
          name="selectStates"
          label={'Select States'}
          placeholder={'States'}
          value={watch('selectStates')}
          options={statesList || []}
          onChange={handleStatesSelect}
          disabled={state?.id ? true : false}
        />
      )}

      {['taluk', 'village']?.includes(watch('location')) &&
        watch('selectStates') &&
        Array?.isArray(districtList?.childEntities) &&
        districtList?.childEntities?.length > 0 && (
          <RHFSelectDropdown
            name="selectDistrict"
            label="Select District"
            placeholder="District"
            value={watch('selectDistrict')}
            options={districtList?.childEntities || []}
            defaultMessage="Please Select State"
            onChange={handleDistrictSelect}
            disabled={state?.id ? true : false}
          />
        )}

      <RHFTextField name="name" label={'Name'} placeholder={'Name'} />
    </Box>
  );
};

export default TalukForm;
