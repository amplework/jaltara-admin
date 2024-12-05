interface Parent {
  id: string;
  name: string;
  entityType: string;
  parentId?: string;
}

interface checkUpperGeo {
  id: string;
  name: string;
  entityType: string;
  parentId: string;
  parents: Parent[];
}

export type LocationListing = {
  id: string;
  name: string;
  entityType: string;
  parentId: string;
  checkUpperGeo: checkUpperGeo;
  farmerCount?: number;
};

export type LocationList = {
  isLoading: boolean;
  isDetailsLoading:boolean;
  error: string | null;
  locationList: LocationListing[] | null;
  locationData:LocationListing
};

export type LocationDetails = {
  selectStates: string;
  selectDistrict: string;
  selectTaluk: string;
  selectVillage: string;
};

export type LocationAdd = {
  location: string;
  name:string
  selectStates?:string;
  selectDistrict?:string;
  selectTaluk?:string
};

