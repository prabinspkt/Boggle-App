const findAllSolutions = (grid, dictionary) => {
  if (dictionary.length > 0) {
    return [dictionary[0]];
  }
  return ['NO_WORD'];
};

export default findAllSolutions;
