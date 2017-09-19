
export function addTask(task) {
  return {
    type: 'ADD_TASK',
    task: task
  }
}

export function toggleEdit(id) {
  return {
    type: 'TOGGLE_EDIT',
    payload: {
      id: id
    }
  }
}

export function fetchTasksLoading(bool){
  return {
    type: 'FETCH_TASKS_LOADING',
    isLoading: bool
  }
}

export function fetchTasksFailure(bool){
  return {
    type: 'FETCH_TASKS_FAILURE',
    hasFailed: bool
  }
}

export function fetchTasksSuccess(tasks) {
  return {
    type: 'FETCH_TASKS_SUCCESS',
    tasks
  }
}

export function setUser(user){
  return {
    type: 'SET_USER',
    user: user
  }
}

export function fetchTasks() {
  return (dispatch) => {
    dispatch(fetchTasksLoading(true));

    fetch('http://localhost:3000/tasks')
    .then((response) => {
      if(!response.ok) {
        throw Error(response.statusText);
      }

      dispatch(fetchTasksLoading(false));
      return response;
    })
    .then((response) => response.json())
    .then((tasks) => dispatch(fetchTasksSuccess(tasks)))
    .catch(() => dispatch(fetchTasksFailure(true)));
  }
}

export function postNewTask(text) {

  var req = new Request('http://localhost:3000/tasks', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({text: text})
  });

  return (dispatch) => {
    dispatch(fetchTasksLoading(true));

    fetch(req)
    .then((response) => {
      if(!response.ok) {
        throw Error(response.statusText);
      }

      dispatch(fetchTasksLoading(false));
      return response;
    })
    .then((response) => response.json())
    .then((task) => dispatch(addTask(task)))
    .catch(() => dispatch(fetchTasksFailure(true)));
  }
}

export function deleteTask(id) {

  var req = new Request('http://localhost:3000/tasks', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'DELETE',
    body: JSON.stringify({id: id})
  });

  return (dispatch) => {
    dispatch(fetchTasksLoading(true));

    fetch(req)
    .then((response) => {
      if(!response.ok){
        throw Error(response.statusText);
      }

      dispatch(fetchTasksLoading(false));
      return response;
    })
    .then(() => dispatch(fetchTasks()))
    .catch(() => dispatch(fetchTasksFailure(true)));
  }
}

export function updateTask(id, text, completed) {

  var req = new Request('http://localhost:3000/tasks', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: JSON.stringify({
      id: id,
      text: text,
      completed: completed
    })
  });

  return (dispatch) => {
    dispatch(fetchTasksLoading(true));

    fetch(req)
    .then((response) => {
      if(!response.ok){
        throw Error(response.statusText);
      }

      dispatch(fetchTasksLoading(false));
      return response;
    })
    .then(() => dispatch(fetchTasks()))
    .catch(() => dispatch(fetchTasksFailure(true)));
  }
}

export function login(username, password) {

  var req = new Request('http://localhost:3000/login', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password: password
    })
  });

  return(dispatch) => {
    fetch(req)
    .then((response) => {
      if(!response.ok){
        throw Error(response.statusText);
      }

      response.json().then((json) => {
        if(json.success){
          dispatch(setUser(json.user))
          // console.log(json);
        }
      })

      return response;
    })
    .catch(() => dispatch(fetchTasksFailure(true))); //TODO Fix
  }
}
