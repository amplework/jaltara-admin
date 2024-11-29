export type CropItem = {
    id: string;
    name: string;
    status: string;
    created: string;
    modified: string;
};

export type CropList = {
  isLoading: boolean;
  error: string | null;
  totalCrop: number | null;
  cropListData: CropItem[] | null;
  cropsDetails:CropItem
};
