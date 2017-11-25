
const balance = (state = {balance: 0, tokens: 0}, action) => {
  switch (action.type) {
    case 'UPDATE_BALANCE':
      return { ...action.payload }
    default:
        return state;
  }
};

export default balance;