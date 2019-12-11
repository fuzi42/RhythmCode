import React, { Component } from "react";
import {message} from 'antd';
import http from './Http'
import AhomeUI from './Ahome'
import UserInfoUI from './UserInfo'
import SendUI from './SendUI'
import ContentUI from './Content'
function HOC(WrappedComponent) {
    return class Home extends Component {
        state={
          user_id:false,
          name:'',
          image:'',
          school:'',
          likes:"",
          collects:"",
          follows:""
        }
        componentWillMount(){
          http.post("http://172.16.1.71:8000/denglu" )
                  .then(data => { //data数据处理
                    if(data!=="数据为空"){
                    var name = data['name'];
                    var image = data['userimages'];
                    var school = data['school'];
                    var likes = data['likes'];
                    var collects = data['collects'];
                    var follows = data['follows'];
                    
                    var user_id = data['user_id'];
                    this.setState({name:name,image:"http://172.16.1.71:8000/"+image,school:school,likes:likes,collects:collects,follows:follows,user_id:user_id});
                    }
                  }).then(response => response, error => error);
         }
        render() {const userInfo={user_id:this.state.user_id,name:this.state.name,image:this.state.image,school:this.state.school,likes:this.state.likes,collects:this.state.collects,follows:this.state.follows};
        return <div>
          <WrappedComponent {...this.props} {...userInfo} />
        </div>
      }
    }
  }
  const Ahome = HOC(AhomeUI)
  const UserInfo =HOC(UserInfoUI) 
  const Send =HOC(SendUI)
  const Content =HOC(ContentUI)
  export {Ahome,UserInfo,Send,Content};