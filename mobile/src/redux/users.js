const initialState = { ids: [], passwords: [] };

export default function users(state = initialState, action) {
  switch (action.type) {
    case 'ADD_NEW_ID':
      const ids = state.ids.concat(action.id);
      const passwords = state.passwords.concat(action.password);
      return { ids, passwords };
      break;
    case 'REMOVE_IDS':
      return initialState;
      break;
    default:
      return state;
  }
}
