export type SuccessResponse<G> = {
  success: true;
  message?: string;
  data?: G;
  path: string;
  timeStamp: string;
};
