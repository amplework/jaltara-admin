// ----------------------------------------------------------------------

export type UserInvoice = {
  id: string;
  createdAt: Date | string | number;
  price: number;
};

export type CreditCard = {
  id: string;
  cardNumber: string;
  cardType: string;
};

export type Follower = {
  id: string;
  avatarUrl: string;
  name: string;
  country: string;
  isFollowed: boolean;
};

export type Gallery = {
  id: string;
  title: string;
  postAt: Date | string | number;
  imageUrl: string;
};

export type UserAddressBook = {
  id: string;
  name: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  zipCode: string;
};

export type Profile = {
  id: string;
  cover: string;
  position: string;
  follower: number;
  following: number;
  quote: string;
  country: string;
  email: string;
  company: string;
  school: string;
  role: string;
  facebookLink: string;
  instagramLink: string;
  linkedinLink: string;
  twitterLink: string;
};

export type UserManager = {
  id: string;
  avatarUrl: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  company: string;
  isVerified: boolean;
  status: string;
  role: string;
  states?: any;
};

export type UserData = {
  id: string;
  avatarUrl: string;
  cover: string;
  name: string;
  follower: number;
  following: number;
  totalPost: number;
  position: string;
};

export type NotificationSettings = {
  activityComments: boolean;
  activityAnswers: boolean;
  activityFollows: boolean;
  applicationNews: boolean;
  applicationProduct: boolean;
  applicationBlog: boolean;
};

export type Friend = {
  id: string;
  avatarUrl: string;
  name: string;
  role: string;
};

export type UserPost = {
  id: string;
  author: {
    id: string;
    avatarUrl: string;
    name: string;
  };
  isLiked: boolean;
  createdAt: Date | string | number;
  media: string;
  message: string;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    author: {
      id: string;
      avatarUrl: string;
      name: string;
    };
    createdAt: Date | string | number;
    message: string;
  }[];
};

export type UserItem = {
  id: string;
  name: string;
  phone: string;
  status: string;
  language: string;
  location: {
    lat: 0;
    lng: 0;
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

export type StatesList = {
  id: string;
  name: string;
  entityType: string;
};

export type CildEntitiesType = {
  id: string;
  name: string;
  entityType: string;
  parentId?: string;
};

type DistrictListData = {
  mainEntity: StatesList;
  childEntities: CildEntitiesType[] | null;
};

type TalukListData = {
  mainEntity: CildEntitiesType;
  childEntities: CildEntitiesType[] | null;
};

type VillageListData = {
  mainEntity: CildEntitiesType;
  childEntities: CildEntitiesType[] | null;
};

export type UserList = {
  isLoading: boolean;
  error: string | null;
  userListData: UserItem[] | null;
  statesList: StatesList[] | null;
  districtList: DistrictListData;
  talukList: TalukListData;
  villageList: VillageListData;
  usersDetails: UsersDetails;
};

export type CreateUserType = {
  name: string;
  phoneNumber: string;
  status: string;
  language: string;
  selectStates: string;
  selectDistrict: string;
  selectTaluk: string;
  selectVillage: string;
};

type Location = {
  lat: number;
  lng: number;
};

type Parent = {
  id: string;
  name: string;
  entityType: string;
};

export type UsersDetails = {
  id: string;
  name: string;
  phone: string;
  status: string;
  language: string;
  photo: string;
  farmerCount?: string | number;
  pitCount?: string | number;
  wellCount?: string | number;
  location: {
    lat: number;
    lng: number;
  };
  created: string;
  modified: string;
  villageId: string;
  stages?: SevekStage[] | null;
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
};

export interface SevekStage {
  id: string;
  stageName: string;
  photo: string;
  created: string;
  modified: string;
  updatedBy: string;
  pitId?: string;
  pit?: PitsDetails;
  wellId?: string;
  well?: WellDetails;
  maintenanceType?: string;
  briefMaintenance?: string;
}

type WellDetails = {
  id: string;
  photo: string;
  level: number;
  villageId: string;
  plotSize: number;
  village?: Village;
};

type PitsDetails = {
  id: string;
  photo: string;
  plotSize: number;
  level: number;
  farmerId: string;
  villageId: string;
  farmer?: Farmer;
  village?: Village;
};

type Farmer = {
  id: string;
  name: string;
  photo: string;
  land: number;
  villageId: string;
};

type Village = {
  id: string;
  name: string;
};
