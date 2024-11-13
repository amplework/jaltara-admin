export type PitItem = {
  userData: {
    id: string;
    name: string;
    phone: string;
    status: string;
    language: string;
    location: {
      lat: number;
      lng: number;
    };
    created: string;
    modified: string;
    villageId: string;
    village: {
      id: string;
      name: string;
      entityType: string;
      parentId: string;
    };
  };
  pitCount: number;
  pitDetails: [];
};

export type PitList = {
  isLoading: boolean;
  error: string | null;
  totalDugPit: number | null;
  totalCompletePit: number | null;
  pitListData: PitItem[] | null;
};
