type Video = {
  url: string;
  status: string;
  thumbnail: string;
  name:string
};

type Tutorial = {
  id: string;
  subject: string;
  status: string;
  description:string
  videos: Video[];
};

export type TutorialList = {
  isLoading: boolean;
  error: string | null;
  tutorialList: Tutorial[];
  tutorialDetails:Tutorial
};

export type TutorialType = {
  subject: string;
  status?: string;
  description: string;
  videos: any;
};
export type VideoAddItems = {
  url: string;
  status: string;
  thumbnail: string;
};
