import React from 'react';
import ReactDOM from 'react-dom'; 
import './App.css';
import $ from 'jquery';

/*class PostRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const post = this.props.post;
    return (
        <h4>{post.time}</h4>   
    );
  }
}*/

class FriendRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const friend = this.props.friend;
    const numPost = this.props.friend.post_list.length;
    var output = [];

    for (var i=0; i<numPost; i++){
      output.push(<h4>{friend.post_list[i].time}   {friend.post_list[i].location}</h4>);
      output.push(<h4>{friend.post_list[i].content}</h4>);

      var numCom = friend.post_list[i].comment_list.length;
      for (var j=0; j<numCom; j++){
        output.push(<h4>{friend.post_list[i].comment_list[j].time}   {friend.name} said: {friend.post_list[i].comment_list[j].comment}</h4>);
      }
    }

    return (
      <div id="post">
        <h4>{friend.name}</h4>
        <img id="friendicon" src={friend.icon}></img>
        <div>
          {output}
        </div>
      </div>       
    );
  }
}

class Postandcomments extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    let rows = [];
    this.props.friend_list.map((friend) => {
      rows.push(
        <FriendRow
          friend={friend}
        />
      );
    });

    return (
      <div>
        {rows}
      </div>
    )
  }

}

class StarRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const friend = this.props.friend;

    if(friend.starredOrNot == 'Y'){
      return (
        <p id="starfriend">{friend.name}</p>        
      );
    }
    else
      return(
        <div></div>);
  }
}

class StarredNameList extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    let rows = [];
    this.props.friend_list.map((friend) => {
      rows.push(
        <StarRow
          friend={friend}
        />
      );
    });

    return (
      <div>
        <h2>Favorites:</h2>
        {rows}
      </div>
    )
  }
}

class Main extends React.Component {
  constructor(props){
    super(props);

  }

  render(){
    if(this.props.openprofile === false){
      return (
          <div id="post_comment">
            <div id="post">
              <Postandcomments
                friend_list={this.props.friend_list}/>
              <div id="inputbox">
                <input id="commentinput" type='text' placeholder='Type a message here'></input>
              </div>
               
            </div>
          </div>
      )
    } else {
      return (
          <div id='user_profile'>
            <img id="usericon"></img>  
              <button id="savebutton" class="myButton">Save</button>
          </div>
      )
    }
  }
}


class Header extends React.Component {
  constructor(props) {
    super(props);

    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleContactInfo = this.handleContactInfo.bind(this);
  }

  handleSignOut(e) {
    this.props.handleSignOut(e);
  }

  handleContactInfo(e) {
    this.props.handleContactInfo(e.target.value);
  }

  render() {
    const name = this.props.loginname;
    const icon = this.props.user_icon;
    return (
      <div>
        <div id="icons">
          <h1>Facestagram</h1> 
          <img id="usericon" src={icon}  onClick={this.handleContactInfo} ></img>
          <h3 id="username" onClick={this.handleContactInfo}>{name}</h3>        
          <button onClick={this.handleSignOut}>log out</button>
        </div>
      </div>
    )
  }
}


class LoginPage extends React.Component {
  constructor(props){
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSignin = this.handleSignin.bind(this);
  }

  handleNameChange(e) {
    this.props.handleNameChange(e.target.value);
  }
  
  handlePasswordChange(e) {
    this.props.handlePasswordChange(e.target.value);
  }
  
  handleSignin(e) {
    this.props.handleSignin(e);
  }

  render(){
    return (
      <div id="login_page">
        <h1>Facestgram</h1>
          <form>
            <span>Username</span>
            <input type="text" value={this.props.loginname} onChange={this.handleNameChange} />
            <span>Password</span>
            <input type="password" value={this.props.loginpassword} onChange={this.handlePasswordChange} />
            <button onClick={this.handleSignin}>Sign in</button>
          </form>
      </div>
    )
  }
}

class Content extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div id="content">
        <div id="header">          
          <div id="icons">
            <Header
              loginname={this.props.loginname}
              user_icon={this.props.user_icon}
              logined={this.props.logined}
              openprofile={this.props.openprofile}
              handleSignOut={this.handleSignOut}
              handleContactInfo={this.handleContactInfo}
            />
          </div>
        </div>
    
        <div id="starlist">
          <StarredNameList
            friend_list={this.props.friend_list}
          />
        </div>

        <div id="main">
          <Main
            openprofile={this.props.openprofile}
            friend_list={this.props.friend_list}
          />
        </div>
    
      </div>
    )
  }
}

class FrontApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: null,
      user_icon: '',
      friend_list: [],
      loginname: '',
      loginpassword:'',
      logined: false,
      openprofile: false,
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSignin = this.handleSignin.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleContactInfo = this.handleContactInfo.bind(this);

  }

  handleNameChange(name) {
    this.setState({
      loginname: name
    })
  }
  
  handlePasswordChange(password) {
    this.setState({
      loginpassword: password
    })
  }

  handleContactInfo() {
    this.setState({
      openprofile: true
    })
  }

  handleSignin(e) {
    e.preventDefault();
    $.post("http://localhost:3001/signin", 
    { 
        "name": this.state.loginname,
        "password": this.state.loginpassword  
    },
    function(data, status) {
        for(var i=0; i<data.friend_list.length; i++){
          this.setState({
            friend_list: [...this.state.friend_list, data.friend_list[i]],
          });
        }

        this.setState({
          user_name: data.user_name,
          user_icon: data.icon,
          logined: true,
        });

    }.bind(this)
    );
  }

  handleSignOut(e) {
      e.preventDefault();
      $.get("http://locatlhost:3001/logout", {
      },
      function(data, status){ 
        this.setState({
          user_name: null,
          user_icon: '',
          loginname: '',
          loginpassword:'',
          logined: false,
          openprofile: false,
        });
      }.bind(this)
      );
  }
  
  render() {
    if (this.state.logined == false){
      return(
        <LoginPage
          loginname={this.state.loginname}
          loginpassword={this.state.loginpassword}
          handleNameChange={this.handleNameChange}
          handlePasswordChange={this.handlePasswordChange}
          handleSignin={this.handleSignin}
        />
      )

    }else{
      return(
        <Content
          loginname={this.state.loginname}
          user_icon={this.state.user_icon}
          logined={this.state.logined}
          friend_list={this.state.friend_list}
          openprofile={this.state.openprofile}
          handleSignOut={this.handleSignOut}
          handleContactInfo={this.handleContactInfo}
        />
      )
    }
  }
}

export default FrontApp;