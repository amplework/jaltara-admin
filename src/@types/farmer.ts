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
  isParticipate: any;
  crops:string[];
  farmingChallenge: string[]
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

type Challenge = {
  id: number;
  name: string;
  uuid: string;
};

interface FarmerData {
  name: string;
  id: string;
  phone: string;
  photo?: string;
  crops?: string[];
  farmingChallenge?: string[];
  challengesData?: Challenge[] | null;
  land: any;
  familyMemberNumber: any;
  farmAvailableDate: string;
  isParticipate: boolean;
  language: string;
  created: string;
  modified: string;
  villageId: string;
  status: string | null;
  pits?: PitWithStages[] | null;
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

type PitWithStages = {
  id: string;
  photo: string;
  plotSize: number;
  level: number;
  farmerId: string;
  villageId: string;
  stages: Stage[];
};
type UpdatedBySevek = {
  id: string;
  name: string;
};

type Stage = {
  id: string;
  stageName: string;
  photo: string;
  created: string;
  modified: string;
  updatedBy: string;
  pitId: string;
  updatedbySevek: UpdatedBySevek;
};
