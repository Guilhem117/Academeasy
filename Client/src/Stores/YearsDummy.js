let years = [
  'M1',
  'M2'
];

const YearsStore = {
  getYears: _ => {
      return years.slice();
  },
};

export default YearsStore;
