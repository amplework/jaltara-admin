export type EquipmentItem = {
  id: string;
  name: string;
  equipment: string;
  created: string;
  modified: string;
  status:string
};

export type EquipmentList = {
isLoading: boolean;
error: string | null;
equipmentListData: EquipmentItem[] | null;
};
