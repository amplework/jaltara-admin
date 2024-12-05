import { Box } from '@mui/system';
import React from 'react';
import { RHFSelectDropdown, RHFTextField } from 'src/components/hook-form';
import { useSelector } from 'src/redux/store';
import { getEntityName } from 'src/utils/common';
interface LocationFormProp {
  statusList?: any;
}
const LocationForm = ({ statusList }: LocationFormProp) => {
  const { checkUpperGeo } = statusList;
  const stateName = getEntityName('state', checkUpperGeo);
  const districtName = getEntityName('district', checkUpperGeo);
  const talukName = getEntityName('taluk', checkUpperGeo);
  const villageName = getEntityName('village', checkUpperGeo);
  console.log('villageName', villageName);

  return (
    <Box
      sx={{
        display: 'grid',
        columnGap: 2,
        rowGap: 3,
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
        p: 2,
      }}
    >
      {stateName?.id && (
        <RHFTextField name="selectStates" label={'Select States'} placeholder={'States'} />
      )}
      {districtName?.id && (
        <RHFTextField name="selectDistrict" label={'Select District'} placeholder={'District'} />
      )}
      {talukName?.id && (
        <RHFTextField name="selectTaluk" label={'Select Taluk'} placeholder={'Taluk'} />
      )}
      {villageName?.id && (
        <RHFTextField name="selectVillage" label={'Select Village'} placeholder={'Village'} />
      )}
    </Box>
  );
};

export default LocationForm;
