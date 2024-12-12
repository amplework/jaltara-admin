export type EquipmentLogsType={
  id:string;
  startTime:string;
  endTime:string;
  timeRecord:string;
  equipmentId:string
}
export type EquipmentItem = {
  id: string;
  name: string;
  equipment: string;
  created: string;
  modified: string;
  status:string;
  phone:string;
  photo?:string;
  logs:EquipmentLogsType[]
};

export type EquipmentList = {
isLoading: boolean;
error: string | null;
equipmentListData: EquipmentItem[] | null;
equipmentDetails:EquipmentItem
};
