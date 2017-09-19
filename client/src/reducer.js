const initialState = {
  tasks: [],
  user: {},
  isLoading: false,
  hasFailed: false
}

export function appReducer(state = initialState, action){

  switch (action.type) {

    case 'ADD_TASK':
      return Object.assign({}, state, {
        tasks: [
          ...state.tasks,
          action.task
        ]
      });

    case 'TOGGLE_EDIT':
      return Object.assign({}, state, {
        tasks: state.tasks.map(task => {
          if(task.id === action.payload.id) {
            return Object.assign({}, task, {
              isEditing: !task.isEditing
            });
          }
          return task;
        }),
      });

    case 'FETCH_TASKS_LOADING':
      return Object.assign({}, state, {
        isLoading: action.isLoading
      });

    case 'FETCH_TASKS_FAILURE':
      return Object.assign({}, state, {
        hasFailed: action.hasFailed
      });

    case 'FETCH_TASKS_SUCCESS':
      return Object.assign({}, state, {
        tasks: action.tasks
      });

    case 'SET_USER':
      return Object.assign({}, state, {
        user: action.user
      });

    default:
      return state;
  }
}
