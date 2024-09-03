export const handleMutateResponse = <T>(res: T[] | undefined) => {
  if (!res || res.length === 0) return null;
  return res[0];
};

export const handleQueryResponse = <T>(res: T | undefined) => {
  if (!res) return null;
  return res;
};
