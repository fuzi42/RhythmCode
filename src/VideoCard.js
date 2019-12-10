import React ,{Component }from 'react';
import {
    Icon,Comment, Avatar, Button, List, message
  } from 'antd';
// import APlayer from "aplayer";
import $ from 'jquery';
import http from './Http'
import loading from './images/loading.gif'
import moment from 'moment';
class Video extends Component{
    constructor(){
        super()
        this.state={title:'',video_url:'',message:'',author_id:'',video_id:'',icon:false ,hove:false,hove1:false,like:false,collect:false,
        likeCount:'',comments:false,comments_list:[],comments_time:[],comments_names:[],comments_images:[]
        }
        this.readall=this.readall.bind(this);
    }
   componentWillMount(){this.getDate()}
   componentDidMount(){$("#content-tap").css({"margin-top":'60px','background':'white'})}
   getDate(){
     return fetch("http://127.0.0.1:8000/show?card="+this.props.video_id , {
        method: 'GET',
        credentials: 'include',
        headers: {
          'content-type': "application/json" //json格式
        },
        mode: 'cors'
      }).then(response => response.json()).then(data => { //data数据处理
        const title = data["cards"]['title'];
        var message = data["cards"]['message'];
        const video_url=data["cards"]["video"];
        const author_id=data["cards"]['user_id'];
        const id=data["cards"]['id'];      
        const likeCount=data['likeCount'];
        const like =data['like'];
        const collect = data['collect'];
        var comments=false;
        if(this.props.nohover){comments=true;}
        const comments_list =data['comments'];
        const time =data['datetime'];
        const comments_names=data['author_name'];
        const comments_images=data['author_image'];
        this.setState({title:title,comments:comments,video_url:video_url,message:message,author_id:author_id,video_id:id,likeCount:likeCount,like:like,collect:collect,comments_list:comments_list,comments_time:time,comments_names:comments_names,comments_images:comments_images});
       
      }).then(response => response, error => error);
    
    }
    readall(){  
    const icon=this.state.icon;
   this.setState({icon:!icon})
   this.setState({hove1:false})
    }
    handleEnter(e){
        if(this.props.hover){}
        else{
       const tap={'title':()=>this.setState({hove:true}),
                  'text': ()=>this.setState({hove1:true})};
      const a=tap[e]();
        }
    }
    handleOut(e){
        if(this.props.hover){}
        else{
       const tap={'title':()=>this.setState({hove:false}),
                  'text': ()=>this.setState({hove1:false})};
      const a=tap[e]();
        }
    }
   
  point=(e)=>{
 //点赞
    console.log(this.props.user_id)
    if(this.props.user_id){
    const className='.'+e+this.props.id;
    if(!this.state.like){http.get('http://127.0.0.1:8000/'+e+'/video='+this.state.video_id+'=yes',).then(data=>{
      if(data['message']){
         $(className).css({'color':'#03a9f457','font-size':'25px'});
         const likeCount=parseInt(this.state.likeCount)+1;
         this.setState({like:true,likeCount:likeCount})
      }
    });
    }
//取消点赞   
    else{http.get('http://127.0.0.1:8000/'+e+'/video='+this.state.video_id+'=no',).then(data=>{
      if(data['message']){
         $(className).css({'color':'gray','font-size':'15px'});
         const likeCount=parseInt(this.state.likeCount)-1;
         this.setState({like:false,likeCount:likeCount})
      }
    });
    }
  }
  }
  collect=(e)=>{
    if(this.props.user_id){
      const className='.'+e+this.props.id;
      if(!this.state.collect){http.get('http://127.0.0.1:8000/'+e+'/video='+this.state.video_id+'=yes',).then(data=>{
        if(data['message']){
           $(className).css({'color':'#03a9f457','font-size':'25px'});  
           this.setState({collect:true})
        }
      });
      }
  //取消点赞   
      else{http.get('http://127.0.0.1:8000/'+e+'/video='+this.state.video_id+'=no',).then(data=>{
        if(data['message']){
           $(className).css({'color':'gray','font-size':'15px'});       
           this.setState({collect:false})
        }
      });
      }
    }
  }
  comments=()=>{
    const comment=!this.state.comments;
    this.setState({comments:comment})
  }
  edit=()=>{
    window.open('/ahome/editvid='+this.state.video_id+'/');
  }
    render(){
      if(this.state.like){
        const className='.like'+this.props.id;
         $(className).css({'color':'#03a9f457','font-size':'25px'});
      }
      if(this.state.collect){
        const className='.collect'+this.props.id;
         $(className).css({'color':'#03a9f457','font-size':'25px'});
      }
      const name='.video-title'+this.props.id;
      if(this.state.hove){
        $(name).css("color","#0000ff82");
      }
      else{
        $(name).css("color","black");
      }
    var likeCount='点赞';var collect='收藏';
    if(this.state.like){
        likeCount=this.state.likeCount;
    }
    if(this.state.collect){
        collect='已收藏';
    }
      var text=''
      if(!this.state.icon) {  text = this.state.preview;}
      else{ text=this.state.message}
     const textId='text'+this.props.id;   //卡片id
     var url='/ahome/'+this.state.author_id+'/video/'+this.state.video_id;
      const titleName='video-title'+this.props.id;
      const like_id='like'+this.props.id;
      const collect_id='collect'+this.props.id;
      var Comment='';var comment='留言';var comments_list=[];
      if(this.state.comments_list!==[] && this.state.comments_list){
      for(var i=0;i<this.state.comments_list.length;i++){
          comments_list[i]={ author:this.state.comments_names[i],
          avatar: this.state.comments_images[i],
          content: <p>{this.state.comments_list[i]}</p>,
          datetime: this.state.comments_time[i],}
      }
    }
      if(this.state.comments){
        Comment=<div style={{border:'1px solid #e3d5d58f',margin:'10px 0',marginTop:15,padding:10,}}><Comments id={this.props.id} video_id={this.state.video_id} user_id={this.props.user_id} user_name={this.props.user_name} user_image={this.props.user_image} comments_list={comments_list}/></div>
        comment='收起留言';
      }
      var load='';
      if(this.state.video_url ===''){
          load=<img src={loading} alt='' style={{width:100,height:'auto',marginLeft:'40%'}} />
      }
      var title=<a className={titleName} href={url} target='_blank' onMouseEnter={this.handleEnter.bind(this,'title')}  onMouseLeave={this.handleOut.bind(this,'title')} rel="noopener noreferrer" style={{fontWeight:'bolder',fontSize:'18px',color:'black',textDecoration:'none'}}>{this.state.title}</a>;
      var video_size={width:590,outline:"none"};var message='';
      var content_size={
            width:'100%', minHeight:100,
            padding: 30,
            borderBottom: "#eee 1px solid",
            backgroundColor:'white'
            }
      if(this.props.nohover){title=<h3 style={{fontWeight:'bolder',fontSize:'18px',color:'black',textDecoration:'none'}}>{this.state.title}</h3>;
        video_size={width:670,height:450,background:'black',outline:"none"};
        message=<div><p>{this.state.message}</p></div>;
        content_size.width=800;
    }
    var edit='';
      if(this.props.edit){
      edit=<div className='mdui-ripple' style={{marginLeft:650,cursor:'pointer',textAlign:'right'}} onClick={this.edit}><Icon type="edit" theme="filled"/>编辑</div>;
      }
    return(<div style={content_size}>
              {load}
              {title}
            <div style={{marginTop:10}}><video  src={this.state.video_url} controls="controls" style={video_size}/></div>
            <div style={{marginTop:10,color:'gray',fontSize:15}}>
            <div className='mdui-ripple' style={{float:'left',marginRight:5,cursor:'pointer'}} onClick={this.point.bind(this,'like')}><Icon className={like_id} type="heart" theme="filled"/></div><h5 style={{float:'left',margin:0,marginRight:5,fontSize:14,fontWeight:'normal',cursor:'pointer'}} onClick={this.point.bind(this,'like')}>{likeCount}</h5>
            <div className='mdui-ripple' style={{float:'left',marginRight:5,cursor:'pointer'}} onClick={this.collect.bind(this,'collect')}><Icon className={collect_id} type="star" theme="filled"  /></div><h5 style={{float:'left',margin:0,marginRight:5,fontSize:14,fontWeight:'normal',cursor:'pointer'}} onClick={this.collect.bind(this,'collect')}>{collect}</h5> 
            <div className='mdui-ripple' style={{float:'left',marginRight:5,cursor:'pointer'}} onClick={this.comments}><Icon type="message" theme="filled"/></div><h5 style={{margin:0,marginRight:5,fontSize:14,fontWeight:'normal',cursor:'pointer'}} onClick={this.comments}>{comment}</h5>
            {edit}
            </div>
            {message}
            {Comment}
        </div>)
    }
}

class Comments extends React.Component {
    state = {
      comments: [],
      submitting: false,
      value: '',
    };
  componentWillMount(){
    this.setState({comments:this.props.comments_list})
  }
    handleSubmit = () => {
     const text=$('#comment'+this.props.id).text();console.log(text);
     if(this.props.user_id){
     const data={id:this.props.video_id,user_id:this.props.user_id,comments:text}
     http.post('http://127.0.0.1:8000/comment/',data);
      setTimeout(() => {
        
        this.setState({
          submitting: false,
          value: '',
          comments: [
            {
              author: this.props.user_name,
              avatar: this.props.user_image,
              content: <p>{text}</p>,
              datetime: moment().fromNow(),
            },
            ...this.state.comments,
          ],
        });
      }, 1000);
    }
    else{message.error('请先登录！')}
    };
  
    handleChange = e => {console.log(e.target.value)
      this.setState({
        value: e.target.value,
      });
    };
  
    render() {
      const { comments, submitting, value } = this.state;
      const CommentList = ({ comments }) => (
        <List 
          dataSource={comments}
          header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
          itemLayout="horizontal"
          renderItem={props => <Comment {...props} style={{borderBottom:'1px solid #e3d5d58f'}}/>}
        />
      );
      
      const Editor = ({ onChange, onSubmit, submitting, value }) => (
        <div>
            <div contentEditable="true" id={'comment'+this.props.id} style={{width:450,minHeight:30,marginRight:10,borderRadius:'3px',border:'1px solid #808080ab',padding:5}}></div>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary" style={{height:35 ,backgroundColor:'#0000ff82',left:460,bottom:34}}>
              留言
            </Button>
         
        </div>
      );
      return (
        <div>
          {comments.length > 0 && <CommentList comments={comments} />}
          <Comment style={{height:75}}
            avatar={
              <Avatar
                src={this.props.user_image}
                alt=''
              />
            }
            content={
              <Editor
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
                submitting={submitting}
                value={value}
              />
            }
          />
        </div>
      );
    }
  }
export default Video;