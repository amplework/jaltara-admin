type Village = {
  id: string;
  name: string;
};

type UpdatedBySevek = {
  id: string;
  name: string;
};

export type Stage = {
  id: string;
  wellId: string;
  photo?: string;
  created: string;
  updatedBy: string;
  stageName?:string;
  updatedbySevek: UpdatedBySevek;
};

export type WellsItem = {
  id: string;
  photo: string;
  gpsLocation: string;
  level: number;
  description: string;
  villageId: string;
  plotSize: number;
  village: Village;
  stages: Stage[];
};

export type WellsData = {
  isLoading: boolean;
  error: string | null;
  wellsListData: WellsItem[] | null;
  wellsDetails: WellsDetails;
};

export type WellsDetailsType = {
  // gpsLoaction: string;
  plotSize: string;
  level: string;
  description: string;
  selectStates: string;
  selectDistrict: string;
  selectTaluk: string;
  selectVillage: string;
};

type WellsDetails = {
  id: string;
  photo: string;
  gpsLocation: string;
  checkUpperGeo: {
    id: string;
    name: string;
    entityType: string;
    parentId: string;
    parents: {
      id: any;
      name: any;
      entityType: any;
    }[];
  };
  level: string;
  description: string;
  villageId: string;
  plotSize: string;
  village: Village;
  stages: Stage[];
};
