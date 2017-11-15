const createList =  (state = [], action) => {
    switch (action.type) {
      case 'RECEIVE_TODOS':
        return action.response.map(todo => todo.surname);
      default:
        return state;
    }
  };



export default createList;

export const getIds = (state) => state;
