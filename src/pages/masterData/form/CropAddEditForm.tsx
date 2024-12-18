import { Box } from '@mui/system';
import React from 'react';
import { RHFSelectDropdown, RHFTextField } from 'src/components/hook-form';
interface CropAddEditFormProp {
  statusList?: any;
  methods?:any
}
const CropAddEditForm = ({ statusList,methods }: CropAddEditFormProp) => {
  const {watch}=methods
  return (
    <Box
      sx={{
        display: 'grid',
        columnGap: 2,
        rowGap: 3,
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
        p:2
      }}
    >
      <RHFTextField name="name" label="Crop Name" />
      <RHFSelectDropdown
        name="status"
        label={'Status'}
        value={watch('status')}
        placeholder={'Status'}
        options={statusList}
      />
      {/* <RHFTextField name="equipment" label="Equipment Name" /> */}
    </Box>
  );
};

export default CropAddEditForm;
