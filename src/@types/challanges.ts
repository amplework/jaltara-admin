export type ChallangesItem = {
    id: string;
    status: string;
    challenge:string
};

export type ChallengesItemList = {
  isLoading: boolean;
  error: string | null;
  totalCrop: number | null;
  challengesListData: ChallangesItem[] | null;
  challengesDetails:ChallangesItem
};
