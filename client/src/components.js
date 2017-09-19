import React, { Component } from 'react';

export const Task = (props) => {
  const { task } = props;
  var _input;

  var styles = {
    float: 'right',
    verticalAlign: 'baseline',
    lineHeight: '1.5',
    padding: '0 0 0 0.75rem'
  };

  if(task.isEditing){
    return(
      <div>
        <input type="text" style={{border: "0px", outline: "none", width: "80%"}} ref={input => (_input = input) && input.focus()}  />
        <button onClick={() => props.deleteTask(task.id)} type="button" className="btn btn-link" style={styles}>Delete</button>
        <button onClick={() => props.updateTask(task.id, _input.value, task.completed)} type="button" className="btn btn-link" style={styles}>Save</button>
      </div>
    );
  }else{
    return(
      <div>
        <span onClick={() => props.updateTask(task.id, task.text, !task.completed)} style={(task.completed) ? {textDecoration: 'line-through'} : {}}>{task.text}</span>
        <button onClick={() => props.deleteTask(task.id)} type="button" className="btn btn-link" style={styles}>Delete</button>
        <button onClick={() => props.toggleEdit(task.id)} type="button" className="btn btn-link" style={styles}>Edit</button>
      </div>
    );
  }
}

export const TaskList = (props) => {
  const { tasks } = props;

  if(props.isLoading){
    console.log("Should be loading");
    return(<p>Loading</p>);
  }else{
    return(
      <div className="tasks">
        <ul className="list-group">
          {tasks.map(task => (
            <li key={task.id} className="list-group-item">
              <Task
              task={task}
              toggleTask={props.toggleTask}
              deleteTask={props.deleteTask}
              toggleEdit={props.toggleEdit}
              updateTask={props.updateTask}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export class NewTask extends Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  render(){
    return(
      <div className="newTask input-group">
        <input id="text" type="text" onKeyPress={this.handleChange} className="form-control" placeholder="Enter new task"/>
      </div>
    );
  }

  handleChange(e) {
    if (e.key === 'Enter' && e.target.value !== "") {
      this.props.addTask(e.target.value);
      e.target.value = "";
    }
  }
}

export class Login extends Component {
  constructor(props) {
    super(props);

    this.inputStyle = {
      float: "left",
      marginRight: "10px"
    }

    this.btnStyle = {
      float: "left",
      padding: "0.25em"
    }

  }

  handleSubmit = () => {
    this.props.login(this.username.value, this.password.value);
  }

  render(){
    if(Object.keys(this.props.user).length !== 0){
      return(
        <div style={{padding: "6px 0px 6px 0px"}}>
          <b>this.props.user.username</b>
        </div>
      );
    }else{
      return(
        <div style={{padding: "6px 0px 6px 0px"}}>
          <input type="text" ref={input => this.username = input} style={this.inputStyle} placeholder="Username" className="form-control form-control-sm col-2" />
          <input type="password" ref={input => this.password = input} style={this.inputStyle} placeholder="Password" className="form-control form-control-sm col-2" />
          <button type="button" onClick={this.handleSubmit} style={this.btnStyle} className="btn btn-link" >Login</button>
          <button type="button" style={this.btnStyle} className="btn btn-link" >Register</button>
        </div>
      );
    }
  }
}
