
const balance = (state = {contract: {}, address: ''}, action) => {
  switch (action.type) {
    case 'ASSIGN_CONTRACT':
      return { ...state, contract: action.contract };
      break;
      case 'ASSIGN_ADDRESS':
      return { ...state, address: action.address };
      break;
    default:
      return state;
  }
};
  
  export default balance;