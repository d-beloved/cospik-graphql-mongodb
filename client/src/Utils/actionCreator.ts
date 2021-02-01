const actionCreator = (type: string, payload?: any) => {
  return {
    type,
    payload,
  };
};

export default actionCreator;
