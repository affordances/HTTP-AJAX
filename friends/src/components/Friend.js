import React from 'react';
import '../App.css';
import axios from 'axios';
import Form from './Form';

class Friend extends React.Component {
  state = {
    friend: null,
    isEditing: false,
    name: "",
    age: "",
    email: ""
  }

  componentDidMount() {
    axios
      .get(`http://localhost:5000/friends/${this.props.match.params.id}`)
      .then(response => {
        this.setState({ friend: response.data,
                        name: response.data.name,
                        age: response.data.age,
                        email: response.data.email });
      })
      .catch(error => console.log(error));
  }

  toggleEditMode = e => {
    e.preventDefault();

    this.setState({ isEditing: true });
  }

  handleEditChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleEditCancel = e => {
    e.preventDefault();
    this.setState({ isEditing: false,
                    name: "",
                    age: "",
                    email: "" });
  }

  handleEditFriend = e => {
    e.preventDefault();

    const editedFriend = { name: this.state.name,
                           age: this.state.age,
                           email: this.state.email };

    axios
      .put(`http://localhost:5000/friends/${this.props.match.params.id}`, editedFriend)
      .then(response => {
        const friend = response.data.find(friend => friend.id === Number(this.props.match.params.id));
        this.setState({ isEditing: false, friend });
      })
      .catch(error => console.log(error));
  }

  handleDelete = e => {
    e.preventDefault();

    axios
      .delete(`http://localhost:5000/friends/${this.props.match.params.id}`)
      .then(response => {
        this.setState({ friend: null });
        this.props.handleUpdateFriends(response.data, Number(this.props.match.params.id));
      })
      .catch(error => console.log(error));
  }

  render() {
    if (!this.state.friend) {
      return <div>Loading friend information...</div>;
    }

    if (this.state.isEditing) {
      return (
        <Form name={this.state.name}
              age={this.state.age}
              email={this.state.email}
              handleChange={this.handleEditChange}
              handleCancel={this.handleEditCancel}
              handleFriendSubmit={this.handleEditFriend} />
      )
    }

    return (
      <div className="friend">
        <div className="friendDetail"><b>Name:</b> {this.state.friend.name}</div>
        <div className="friendDetail"><b>Age:</b> {this.state.friend.age}</div>
        <div className="friendDetail"><b>Email:</b> {this.state.friend.email}</div>
        <button onClick={this.toggleEditMode}>Edit</button>
        <button onClick={this.handleDelete}>Delete</button>
      </div>
    );
  }
}

export default Friend;
