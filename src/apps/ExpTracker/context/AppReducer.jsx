export default (state, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      };
    case 'ADD_TRANSACTION':
      const exists = state.transactions.some(transaction => transaction.id === action.payload.id);
  return {
    ...state,
    transactions: exists ? state.transactions : [...state.transactions, action.payload]
  };
    case 'SET_USER_ID':
      return {
        ...state,
        userId: action.payload
      };
    case 'SET_FAMILY_ID':
      return {
        ...state,
        familyId: action.payload
      };
    default:
      return state;
  }
}
