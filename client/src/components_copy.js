import React, { Component } from 'react';

// export const Task = (props) => {
//   const { task } = props;
//   if(task.completed){
//     return <strike>{task.text}</strike>;
//   } else {
//     return <span>{task.text}</span>;
//   }
// }

export const TaskList = (props) => {
  const { tasks } = props;
  var styles = {
    float: 'right',
    verticalAlign: 'baseline',
    lineHeight: '1.5',
    padding: '0 0 0 0.75rem'
  };
  var strike = {
    textDecoration: 'line-through'
  };

  if(props.isLoading){
    console.log("Should be loading");
    return(<p>Loading</p>);
  }else{
    return(
      <div className="task">
        <ul className="list-group">
          {tasks.map(task => (
            <li key={task.id} className="list-group-item">
              <span id="taskItem" onClick={() => props.toggleTask(task.id)} style={(task.completed) ? strike : {}}>{task.text}</span>
              <button onClick={() => props.deleteTask(task.id)} type="button" className="btn btn-link" style={styles}>Delete</button>
              <button type="button" className="btn btn-link" style={styles}>Edit</button>
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
