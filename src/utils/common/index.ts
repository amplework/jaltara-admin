export const getEntityName = (entityType: string, checkUpperGeo: any) => {
  if (!checkUpperGeo) return null;
  return checkUpperGeo?.entityType === entityType
    ? checkUpperGeo
    : checkUpperGeo?.parents?.find((item: any) => item?.entityType === entityType);
};
