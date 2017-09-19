import React, { Component } from 'react';
import { connect } from 'react-redux'
import { TaskList, NewTask, Login } from './components';

import {
  fetchTasks,
  postNewTask,
  deleteTask,
  toggleEdit,
  updateTask,
  login
} from './actions';

class App extends Component {

  constructor(){
    super();
    this.style = {
      padding: "10px"
    }
  }

  componentDidMount(){
    this.props.fetchTasks();
  }

  render() {
    return (
      <div id="Container" className="container">

        <div id="Login" style={this.style}>
          <Login
          login={this.props.login}
          user={this.props.user}
          />
          <br/>
        </div>

        <div id="TaskList" style={this.style}>
          <TaskList
          tasks={this.props.tasks}
          deleteTask={this.props.deleteTask}
          toggleEdit={this.props.toggleEdit}
          updateTask={this.props.updateTask}
          />
        </div>

        <div id="NewTask" style={this.style}>
          <NewTask addTask={this.props.addTask} />
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tasks: state.tasks,
    user: state.user,
    hasFailed: state.hasFailed,
    isLoading: state.isLoading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTasks: () => dispatch(fetchTasks()),
    toggleEdit: (id) => dispatch(toggleEdit(id)),
    deleteTask: (id) => dispatch(deleteTask(id)),
    addTask: (text) => dispatch(postNewTask(text)),
    login: (username, password) => dispatch(login(username, password)),
    updateTask: (id, text, completed) => dispatch(updateTask(id, text, completed))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
