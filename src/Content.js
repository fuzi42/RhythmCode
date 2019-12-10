import React ,{Component }from 'react';
import $ from 'jquery';
import HomeTitle from './HomeTitle'
import ArticleCard from './ArticleCard'
import VideoCard from './VideoCard'
import {
  Icon, message
} from 'antd';
import http from './Http'
const Home =props=>{var content_id='';var author_id=''; var content='';
        $('#show').parent().css('height','auto');
        if(props.match.params.id && props.match.params.content){
            content_id=props.match.params.content;
            author_id=props.match.params.id;
          }
        if(content_id){ console.log(props)
          const time=content_id;
          content=<div style={{width:700,minHeight:600}}>
            <div style={{width:'100%',backgroundColor:'#80808040',}}> 
            <Icon type="calendar" style={{height:40,margin:'0 20px',lineHeight:3}}/>{time}</div>
        <ArticleCard id={0} key={0} hover={true} user_id={props.user_id} author_id={author_id} article_id={content_id} user_name={props.name} user_image={props.image} readall={true} />
        </div>
        }
       
        return(
        <div id='content-tap' style={{margin:'auto',marginTop:230}}>
        <HomeTitle user_id={props.user_id} image={props.image}/>
        <div  style={{width: '1000px' ,height:'100%',margin:'auto'}}>
        <Author author_id={author_id} content_id={content_id} user_id={props.user_id} follows={props.follows}/>
        {content}
        
        </div>
        </div>)
}
class Author extends Component{
    constructor(){
      super()
      this.state={author_id:'',content_id:'',icon:false,author_name:'',author_image:'',moretitle:[],follow:false}
  }
 async componentWillMount(){
   return await fetch("http://127.0.0.1:8000/show?people=" +this.props.author_id, {
      method: 'GET',
      headers: {
        'content-type': "application/json" //json格式
      },
      mode: 'cors'
    }).then(response => response.json()).then(data => { //data数据处理
      var name = data['name'];
      var image = data['userimage'];
      var moretitle =[]
     for (var i in data["cardsList"]){
        const title={id:data["cardsList"][i]["id"],title:data["cardsList"][i]['title']};
        moretitle.push(title)
     }
     var follow = false;
     for(var k of this.props.follows){
       if(k === this.props.author_id){
         follow =true;
       }
     }
    this.setState({moretitle:moretitle,author_name: name, author_image: image,follow:follow})
    // http.get("http://127.0.0.1:8000/show?follow/"+this.props.author_id+'=?').then(data=>{
    //     if(data['follow']){
    //     this.setState({follow:data['follow']})}
    //     }).then(response => response, error => error);
      // this.setState({author_name: name, author_image: image});
    }).then(response => response, error => error);
  } 
  follow=()=>{
    if(this.props.author_id!==this.props.user_id){
    if(!this.state.follow){
    http.post("http://127.0.0.1:8000/doing?follows="+this.props.author_id+'&sure=yes').then(data=>{
      if(data['message']){message.success('关注成功！')}
      this.setState({follow:true})
      }).then(response => response, error => error);
    }
    else{
      http.post("http://127.0.0.1:8000/doing?follows="+this.props.author_id+'&sure=no').then(data=>{
      if(data['message']){message.success('取消关注！')}
      this.setState({follow:false})
      }).then(response => response, error => error);
    }
  }
  }
    render(){
      const {moretitle} =this.state;
      var title=[];
      var cout=moretitle.length;
      if(cout>0){
      for(var i=0;i<cout;i++){
          const url=moretitle[i].id;
          title[i]=<a key={i} style={{color:'#175199',display:'block',margin:'10px auto'}} href={url}>{moretitle[i].title}</a>
      }
    }
      var authorUrl='/people/'+this.props.author_id+'/';
      var follows='关注';
      if(this.state.follow){follows='已关注'}
      return(
        <div id='show' style={{width:'100%',height:'100%'}}>
         {/* <div style={{width:'1000px',height:100,margin:'auto 300px',backgroundColor:'white'}}><h1 style={{fontWeight:'bold'}}></h1></div> */}
         <div style={{width:280,height:'auto',borderBottom:'#00000012 1px solid', position:'relative',float:'right'}}>
           <div><div style={{padding:20,borderBottom:'#00000012 1px solid',background:'white',}}><h3 style={{fontWeight:'bold'}}>关于作者</h3></div>
           <div  style={{height:100,padding:20,background:'white',}}>     
            <a href={authorUrl}> <img src={this.state.author_image} alt='' style={{width:60,height:60,float:'left',borderRadius:5,}} />
              <h3 style={{fontWeight:'bold',lineHeight:3,marginLeft:20,marginTop:0,color:'black',float:'left'}}>{this.state.author_name}</h3>
            </a>
           </div>
              <div style={{background:'white',padding:5}}> 
              <button className='mdui-btn mdui-btn-raised mdui-ripple' style={{width:113,height:30,lineHeight:0,backgroundColor:'#0084ff',color:'white',margin:'0 15px',}} onClick={this.follow}>{follows}</button>
              <button className='mdui-btn mdui-btn-raised mdui-ripple' style={{width:113,height:30,lineHeight:0,backgroundColor:'white',color:'gray',border:'1px solid #80808094',}}>私信</button>
              </div>
           </div>
           <div style={{margin:'10px auto'}}><div style={{padding:20,borderBottom:'#00000012 1px solid',background:'white',}}><h3 style={{fontWeight:'bold'}}>更多内容</h3></div>
           <div  style={{height:220,padding:20,overflow:'hidden',borderBottom:'#00000012 1px solid',background:'white',}}>
            {title}
           </div>
           </div>
         </div>
        </div>
      )
    }
  }
export default Home;