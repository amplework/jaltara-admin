export type VillageData = {
  entityType: string;
  id: string;
  name: string;
  parentId: string;
};

export type FarmerListData = {
  name: string;
  id: string;
  phone: string;
  land: number;
  familyMemberNumber: number;
  farmAvailableDate: string;
  isParticipate: boolean;
  language: string;
  created: string;
  modified: string;
  villageId: string;
  crops: string[];
  farmingChallenge: string[];
  village: VillageData | null;
  totalPits?: string;
  photo?: string;
};

export type FarmerList = {
  isLoading: boolean;
  error: string | null;
  farmerListData: FarmerListData[] | null;
  farmersDetails: FarmerData;
};

export type FarmerDetailsType = {
  name: string;
  phone: string;
  status: string;
  language: string;
  selectStates: string;
  selectDistrict: string;
  selectTaluk: string;
  selectVillage: string;
  land: Number;
  familyMemberNumber: Number;
  farmAvailableDate: string;
  isParticipate: Boolean;
};

interface Parent {
  id: string;
  name: string;
  entityType: string;
  parentId?: string; // Optional if not all parents have a parentId
}

interface Village {
  id: string;
  name: string;
  entityType: string;
  parentId: string;
}

interface CheckUpperGeo extends Village {
  parents: Parent[];
}

interface FarmerData {
  name: string;
  id: string;
  phone: string;
  land:any;
  familyMemberNumber: any;
  farmAvailableDate: string;
  isParticipate: boolean;
  language: string;
  created: string;
  modified: string;
  villageId: string;
  status: string | null;
  village?: {
    id: string;
    name: string;
    entityType: string;
    parentId: string;
  };
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
}

interface FarmerResponse {
  statusCode: number;
  message: string;
  data: FarmerData;
}
