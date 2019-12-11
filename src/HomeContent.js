import React ,{Component }from 'react';
import {
    Icon
  } from 'antd';
import APlayer from "aplayer";
import $ from 'jquery';
import http from './Http'
import ArticleCard from './ArticleCard'
import VideoCard from './VideoCard'
class HomeContent extends Component{
    constructor(){
        super()
        this.state={content_id:false,hove:'recommend',index:0,kind:"article",} 
    }
componentDidMount(){
  document.addEventListener('scroll',this.test.bind(this,this.more))
  this.point();
}
 test(more){
  var scrollTop = $(window).scrollTop();
  //页面高度
 var scrollHeight = $(document).height();
   //浏览器窗口高度
 var windowHeight = $(window).height();
//  console.log(scrollTop,windowHeight,scrollHeight)
  if (scrollTop + windowHeight - scrollHeight>-10) {
     more()
   }
 }
  point(e){
    if(e===undefined){e='article'}
      $('.nav').each(function(){
        $(this).css({'border':'none'})
    });
    const id='#'+e;
       $(id).css({'border-bottom':'blue 2px solid'})
    console.log(e)
    this.setState({hove:e,content_id:false,index:0,kind:e});
    setTimeout(() => {
      if(e===this.state.hove){this.more();}
    }, 50);
  }   
     more=()=>{    
     return fetch("http://172.16.1.71:8000/show?cardlist="+this.state.index+"&kind="+this.state.kind, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'content-type': "application/json" //json格式
        },
        mode: 'cors'
      }).then(response => response.json()).then(data => { //data数据处理
        // const id=data['id'];    
        // var content_id=this.state.content_id;
        
        // if(content_id){
        //   id.forEach(element => {
        //       content_id.add(element);
        //   });
        // }
        // else{content_id=new Set(id);}
        // console.log(content_id)
        // this.setState({content_id:content_id});  
        // if(content_id.length % 5 <=3 && content_id.length % 5>1){this.more()}
        
        var cardList = data["cards"];
        var content_id =[];
        for(var i in cardList){console.log(i)
          content_id.push(cardList[i]["id"]);          
        };
        
        this.setState({content_id:content_id})
      }).then(response => response, error => error);    
      
    }
  
    render(){ 
    
      //  $('#recommend').css({'border-bottom':'blue 2px solid','margin-top':'10px'})
        var p={width: 70,height:50,margin:'auto ',float:'left',cursor:'pointer',textAlign:'center',background:'#0000ff1c',borderRadius:20,lineHeight:1}
        var content = [];
       
        if(this.state.content_id){
          for(var i of this.state.content_id){
            
          content.push(<ArticleCard id={content.length} key={i} article_id={i} user_id={this.props.user_id} user_name={this.props.user_name} user_image={this.props.user_image} />)
          
        } 
        }
        return(<div style={{width: '60%' ,height: 'auto',background: '#ffffff',color: 'black',margin:'auto',border:'#80808038 1px solid',position:'absolute',left:'10%'}}>
            <div  style={{width: '100%' ,height: 50,background: '#ffffff',margin:'auto',paddingLeft:15,textAlign:'left'}}>
                <div id="article" className='nav' style={p} onClick={this.point.bind(this,'article')} >
                    <h3 >文章</h3>
                </div>
                <div id='video' className='nav' style={p} onClick={this.point.bind(this,'video')}>
                    <h3 >课程</h3>
                </div>
                <div id='hot' className='nav' style={p} onClick={this.point.bind(this,'hot')}>
                    <h3 >热榜</h3>
                </div>
            </div>
            <hr style={{opacity:0.5 ,margin:0}}/>
            <div style={{width:'100%',height:'auto',margin:'auto',}}>
                {content}
            </div>
            <div style={{width:50,position:'fixed',right:0,bottom:20}}><a href='#top' style={{color:'black'}}><Icon type="to-top" style={{fontSize:40}} /></a></div>
        </div>)
    }
}
export default HomeContent;