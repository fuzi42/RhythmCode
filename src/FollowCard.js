import React ,{Component }from 'react';
import $ from 'jquery';
import {
    Icon,Comment, Avatar, Button, List,message
  } from 'antd';
import http from './Http'

class Follow extends Component{
    constructor(){
        super()
        this.state={name:'',image:'',message:'',user_id:'',follow:true,}
    }
    componentWillMount(){
        return  http.get("http://127.0.0.1:8000/show?people="+this.props.follow_id )
        .then(data => { //data数据处理
          var name = data['name'];
          var image = data['userimage'];
        //   var school = data['school'];
        //   var likes = data['likes_id'];
          var user_id = data['user_id'];
          this.setState({name:name,image:image,user_id:user_id});
          
        }).then(response => response, error => error);
    }
    handleEnter=()=>{
      if(this.state.follow){ $('#unfollow').html('取消关注')}
    }
    handleOut=()=>{
        if(this.state.follow){ $('#unfollow').html('已关注')}
        else{$('#unfollow').html('关注')}
    }
    unfollow=()=>{
       if(this.state.follow){ 
           http.post("http://127.0.0.1:8000/doing?follows="+this.props.follow_id+'&sure=no').then(data=>{
            if(data['message']){message.success('取消关注！')}
            this.setState({follow:false})
            }).then(response => response, error => error);
        }
        else{
            http.post("http://127.0.0.1:8000/doing?follows="+this.props.follow_id+'&sure=yes').then(data=>{
            if(data['message']){message.success('关注成功！')}
            this.setState({follow:true})
            }).then(response => response, error => error);
        }
    }
    render(){
        var Url='/people/'+this.state.user_id+'/';
        return(<div style={{width:'100%',height:'150px',padding:25}}>
            <div style={{height:'100%'}}>
            <a href={Url} style={{color:'black'}}>
            <img src={this.state.image} alt='nothing' style={{width:100,height:100,borderRadius:'8px',float:'left'}}/><div style={{float:'left',fontSize:20,marginLeft:10,fontWeight:'bold'}}>{this.state.name}</div>
            </a>
            <Button id='unfollow' className='mdui-btn mdui-btn-raised mdui-ripple' style={{width:100,float:'right',marginTop:35,backgroundColor:'gray',color:'#ffffffa6',}} onMouseEnter={this.handleEnter}  onMouseLeave={this.handleOut} onClick={this.unfollow}>已关注</Button>
            </div>
       
            </div>
        )
    }
}
export default Follow;