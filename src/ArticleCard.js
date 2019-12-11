//文章卡片 自带点赞、收藏、留言功能
import React ,{Component }from 'react';
import $ from 'jquery';
import {
    Icon,Comment, Avatar, Button, List,message
  } from 'antd';
import http from './Http'
import loading from './images/loading.gif'
import moment from 'moment';
class Article extends Component{
    constructor(){
        super()
        this.state={title:'',preview:'',message:'',title_image:'',video_url:'',author_id:'',article_id:'',icon:false ,hove:false,hove1:false,like:false,collect:false,
        likeCount:'',comments:false,comments_list:[],comments_time:[],comments_names:[],comments_images:[],label:"",kind:"article"
        }
        this.readall=this.readall.bind(this);
    }
   componentWillMount(){
        this.getDate()
  }
   componentDidMount(){$("#content-tap").css({"margin-top":'230px',"background":'none'})}
  getDate(){
     return fetch("http://172.16.1.71:8000/show?card="+this.props.article_id , {
        method: 'GET',
        credentials: 'include',
        headers: {
          'content-type': "application/json" //json格式
        },
        mode: 'cors'
      }).then(response => response.json()).then(data => { //data数据处理
        const title = data["cards"]['title'];
        var message = data["cards"]['message'];
        var preview='';
        if(this.props.readall){preview=message}
        else{preview =message.substring(0,200)+"...<button class='readall' >阅读全文↓</button'"; }
        var picture='';
        if(data["cards"]['image']!=='' && data["cards"]['image']!==null ){
            picture =data["cards"]['image']
          }
        if(data["cards"]["video"]!=="" && data["cards"]["video"]!==null){
          this.setState({kind:"video",video_url:data["cards"]["video"],icon:true,hove1:true})
        }
        const author_id=data["cards"]['user_id'];
        const id=data["cards"]['id'];      
        const likeCount=data["cards"]['likes'];
        const like =data["likes"];
        const collect =data["collects"];
        var comments=false;
        if(this.props.hover){comments=true;}
        var comments_list = [];
        for(var i in data['comments']){
          comments_list.push(data['comments'][i])
        }
        const label = data["cards"]["kind"]
       this.setState({title:title,comments:comments,preview:preview,message:message,title_image:picture,author_id:author_id,article_id:id,likeCount:likeCount,like:like,collect:collect,comments_list:comments_list,label:label});
       
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
    if(!this.state.like){http.post('http://172.16.1.71:8000/doing?'+e+'='+this.state.article_id+'&sure=yes',).then(data=>{
      if(data['message']){
         $(className).css({'color':'#03a9f457','font-size':'25px'});
         const likeCount=parseInt(this.state.likeCount)+1;
         this.setState({like:true,likeCount:likeCount})
      }
    });
    }
//取消点赞   
    else{http.post('http://172.16.1.71:8000/doing?'+e+'='+this.state.article_id+'&sure=no',).then(data=>{
      if(data['message']){
         $(className).css({'color':'gray','font-size':'15px'});
         const likeCount=parseInt(this.state.likeCount)-1;
         this.setState({like:false,likeCount:likeCount})
      }
    });
    }
  }
  else{ message.error('请先登录！')}
  }
  collect=(e)=>{
    if(this.props.user_id){
      const className='.'+e+this.props.id;
      if(!this.state.collect){http.post('http://172.16.1.71:8000/doing?'+e+'='+this.state.article_id+'&sure=yes',).then(data=>{
        if(data['message']){
           $(className).css({'color':'#03a9f457','font-size':'25px'});  
           this.setState({collect:true})
        }
      });
      }
  //取消收藏  
      else{http.post('http://172.16.1.71:8000/doing?'+e+'='+this.state.article_id+'&sure=no',).then(data=>{
        if(data['message']){
           $(className).css({'color':'gray','font-size':'15px'});       
           this.setState({collect:false})
        }
      });
      }
    }
    else{
      message.error('请先登录！')
    }
  }
  comments=()=>{
    const comment=!this.state.comments;
    this.setState({comments:comment})
  }
  edit=()=>{
    var url='/ahome/edita='
    if(this.state.kind ==="video"){
      url = '/ahome/editv='
    }
    window.open(url+this.state.article_id);
  }
  goto=()=>{
    window.location.href='/ahome/'+this.state.author_id+'/'+this.state.article_id;
  }
    render(){  
      const titleName='article-title'+this.props.id;
      const like_id='likes'+this.props.id;
      const collect_id='collects'+this.props.id; 
      const textId='text'+this.props.id;   //卡片id
     var url='/ahome/'+this.state.author_id+'/'+this.state.article_id;
      var Comment='';var comment='留言';
      var text_size ={overflow:'hidden',cursor:'pointer'}
      var title='';
      if(this.props.hover){var bk='white';var color='black';
          if(this.state.title_image!==''){bk='linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),  url('+this.state.title_image+')';color='white'}
          title=  <div style={{width:'100%',height:150,margin:'auto',position:'absolute',top:60,left:0,background:bk}}><h1 style={{fontWeight:'bold',lineHeight:4,marginLeft:450,color:color}}>{this.state.title}</h1></div>
      }
      else{
        title=<a className={titleName} href={url} target='_blank' onMouseEnter={this.handleEnter.bind(this,'title')}  onMouseLeave={this.handleOut.bind(this,'title')} rel="noopener noreferrer" style={{fontWeight:'bolder',fontSize:'18px',color:'black',textDecoration:'none'}}>{this.state.title}</a>
      }
      var edit='';
      if(this.props.edit){
      edit=<div className='mdui-ripple' style={{marginLeft:650,cursor:'pointer',textAlign:'right'}} onClick={this.edit}><Icon type="edit" theme="filled"/>编辑</div>;
      }
      var video=''; var video_size={width:300,outline:"none",marginTop:30,marginLeft:280};
      var kind="";
      if(this.state.kind ==="video"){
       
        title = <a className={titleName} href={url} target='_blank' onMouseEnter={this.handleEnter.bind(this,'title')}  onMouseLeave={this.handleOut.bind(this,'title')} rel="noopener noreferrer" style={{fontWeight:'bolder',fontSize:'18px',color:'black',textDecoration:'none',display:'block'}}>{this.state.title}</a>;
        video= <video  src={this.state.video_url}  style={video_size} onClick={this.goto}/>
      if(this.state.label !==""){kind =<div style={{float:'right',padding:"5px 20px",backgroundColor:"#00000012",borderRadius:20}}>{this.state.label}</div>}
        if(this.props.hover){ 
          $("body").css("background",'white'); 
          $("#content-tap").css("margin","100px auto auto")
          title = <h3 style={{fontWeight:'bolder',fontSize:'18px',color:'black',textDecoration:'none'}}>{this.state.title}</h3>
          video_size={width:670,height:450,background:'black',outline:"none",marginBottom:20};$(".face").css("padding","")
          video= <video  src={this.state.video_url} controls="controls" style={video_size}/>
      }else{ text_size ={overflow:'hidden',cursor:'pointer',float:'left',marginTop:-120,width:280} }
      }
      if(this.state.like){
        const className='.likes'+this.props.id;
         $(className).css({'color':'#03a9f457','font-size':'25px'});
      }
      if(this.state.collect){
        const className='.collects'+this.props.id;
         $(className).css({'color':'#03a9f457','font-size':'25px'});
      }
      const name='.article-title'+this.props.id;
      const name1='.text'+this.props.id;
      if(this.state.hove){
        $(name).css("color","#0000ff82");
      }
      else{
        $(name).css("color","black");
      }
      if(!this.state.icon){ 
      if(this.state.hove1){
        $(name1).css("color","gray");
      }
      else{
        $(name1).css("color","black");
      }
      
    }else{ $(name1).css("color","black");}
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
    
    
  
      if(this.state.comments){
        Comment=<div style={{border:'1px solid #e3d5d58f',margin:'10px 0',marginTop:15,padding:10,}}><Comments id={this.props.id} article_id={this.state.article_id} user_id={this.props.user_id} user_name={this.props.user_name} user_image={this.props.user_image} comments_list={this.state.comments_list}/></div>
        comment='收起留言';
      }
      var load='';
      if(this.state.title ===''){
          load=<img src={loading} alt='' style={{width:100,height:'auto',marginLeft:'40%'}} />
      }
     
        return(<div className="face" style={{
            width:'100%', minHeight:100,
            padding: 30,
            borderBottom: "#eee 5px solid",
            backgroundColor:'white'
            }}>
              {load}
              {kind}
              {title}
              {video}
            <div className={textId} style={text_size}  onMouseEnter={this.handleEnter.bind(this,'text')}  onMouseLeave={this.handleOut.bind(this,'text')} onClick={this.readall}  dangerouslySetInnerHTML={{ __html: text}}></div>
            
            <div style={{marginTop:10,color:'gray',fontSize:15}}>
            <div className='mdui-ripple' style={{float:'left',marginRight:5,cursor:'pointer'}} onClick={this.point.bind(this,'likes')}><Icon className={like_id} type="heart" theme="filled"/></div><h5 style={{float:'left',margin:0,marginRight:5,fontSize:14,fontWeight:'normal',cursor:'pointer'}} onClick={this.point.bind(this,'likes')}>{likeCount}</h5>
            <div className='mdui-ripple' style={{float:'left',marginRight:5,cursor:'pointer'}} onClick={this.collect.bind(this,'collects')}><Icon className={collect_id} type="star" theme="filled"  /></div><h5 style={{float:'left',margin:0,marginRight:5,fontSize:14,fontWeight:'normal',cursor:'pointer'}} onClick={this.collect.bind(this,'collects')}>{collect}</h5> 
            <div className='mdui-ripple' style={{float:'left',marginRight:5,cursor:'pointer'}} onClick={this.comments}><Icon type="message" theme="filled"/></div><h5 style={{margin:0,marginRight:5,fontSize:14,fontWeight:'normal',cursor:'pointer'}} onClick={this.comments}>{comment}</h5>
            {edit}
            </div>
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
    console.log(this.props.comments_list)
  }
    handleSubmit = () => {
     const text=$('#comment'+this.props.id).text();console.log(text);
     if(this.props.user_id){
     const data={card_id:this.props.article_id,user_id:this.props.user_id,comments:text}
     http.post('http://172.16.1.71:8000/doing?commits=true',data);
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
  export default Article;
