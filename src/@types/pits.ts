export type PitItem = {
  id: string;
  level: number;
  farmerId: string;
  villageId: string;
  village: {
    id: string;
    name: string;
  };
  farmer: {
    name: string;
    id: string;
  };
  stages: {
    id: string;
    pitId: string;
    stageName: string;
    equipmentId: string;
    created: string;
    updatedBy: string;
    updatedbySevek: {
      id: string;
      name: string;
    };
  }[];
};

export type PitList = {
  isLoading: boolean;
  error: string | null;
  pitListData: PitItem[] | null;
  pitsDetails: PitDetails;
};

export type PitDetails = {
    id: string;
    photo: string;
    gpsLocation: string;
    plotSize: string;
    stageName: string;
    level: string;
    created: string;
    modified: string;
    farmerId: string;
    villageId: string;
    farmer: {
      name: string;
      id: string;
      photo: string;
    };
    stages: {
      id: string;
      pitId: string;
      stageName: string;
      photo: string;
      created: string;
      modified: string;
      updatedBy: string;
    }[];
    village: {
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
        id: string;
        name: string;
        entityType: string;
        parentId?: string;
      }[];
    };
};
