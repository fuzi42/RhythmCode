import React, { Component } from "react";
import {
  Icon,
  Button,
  message,
  Upload
} from 'antd';
import "aplayer/dist/APlayer.min.css";
import APlayer from "aplayer";
import $ from 'jquery';
import HomeTitle from './HomeTitle'
import ArticleCard from './ArticleCard'
import VideoCard from './VideoCard'
import FollowCard from './FollowCard'
const Home=props=>{
    var tap=false;var user_id=false;
   if(props.match.params.user_id==='edit'){
      tap="edit";
   }
   else{
    user_id=props.match.params.user_id;
     tap='Info';
   }
   var isAuthor=false;
   if(user_id===props.user_id){isAuthor=true}
  var tapmap={'Info':<Info user_id={user_id} isAuthor={isAuthor}/>,
          'edit':<Edit user_id={props.user_id} name={props.name} school={props.school}/>}
        return(
            <div style={{backgroundColor:'#cecccc40'}}>
              <HomeTitle  user_id={props.user_id} image={props.image}/>
              {tapmap[tap]}
            </div>
        )
    
}
class Info extends Component {
  constructor() {
    super();
    this.state = {
      user_id: '',
      name: '',
      school: '',
      image: '',
      update: false,
      hove:1,
      title:'',
      message:'',
      picture:'',
      video:'',
      music:'',
      article_id:'',
      video_id:'',
      collect_id:'',
      follow_id:[],
      content:[],

    }
    this.getData = this.getData.bind(this);
    this.get = this.get.bind(this);
    this.update = this.update.bind(this);
  }
  componentWillMount(){
    
      this.getData();
     
  }
  getData() { //请求数据函数

   return fetch("http://127.0.0.1:8000/show?people=" + this.props.user_id, {
      method: 'GET',
      headers: {
        'content-type': "application/json" //json格式
      },
      mode: 'cors'
    }).then(response => response.json()).then(data => { //data数据处理
      const id = data['user_id'];
      const name = data['name'];
      const school = data['school'];
      const image = data['userimage'];
      var article_id=[];
      for (var i in data["cardsList"]){
        var kind = true;
        if(data["cardsList"][i]["video"] !==""){
          kind = false;
        }
          var content ={id:data["cardsList"][i]["id"],kind:kind}
          article_id.push(content)
      }
      const collect_id=data['collects'];
      const follow_id=data['follows'];
      this.setState({name: name, school: school, image: image, user_id:id,article_id:article_id,collect_id:collect_id,follow_id:follow_id})

    }).then(response => response, error => error);

  }

  get(user_id) {
    this.setState({image: user_id})
  }
  update(up) {

    console.log(up)
    this.props.update(up)
  }
  chose(e){
    this.getData();
    this.setState({hove:e});
  }
  render() {
    const put={height:50,float:'left',margin:'10px 20px',padding:10,fontSize:18,cursor:'pointer'}
    
    if(this.state.hove){
      for(var i=1;i<=4;i++){
        const id='#my'+i
        if(i===this.state.hove){
          
          $(id).css('color','black');
        }
        else{
         
          $(id).css('color','gray');
        }
      }
    }
  
    var article_list=[];
    var video_list=[];
      
      for( var item of this.state.article_id){
      if (item["kind"]){
      article_list.push(<ArticleCard id={article_list.length} key={item["id"]}  user_id={this.state.user_id} article_id={item["id"]} user_name={this.state.name} user_image={this.state.image} edit={this.props.isAuthor}/>)
      } 
      else{
      video_list.push(<ArticleCard id={article_list.length} key={item["id"]}  user_id={this.state.user_id} article_id={item["id"]} user_name={this.state.name} user_image={this.state.image} edit={this.props.isAuthor}/>)
      }
    }
    
    var collect_list=[];
    for( var item1 of this.state.collect_id){ 
      collect_list.push(<ArticleCard id={collect_list.length} key={item1}  user_id={this.state.user_id} article_id={item1} user_name={this.state.name} user_image={this.state.image}/>)
    }
    var follow_list=[];
    for( var item3 of this.state.follow_id){
      if(item3){follow_list.push(<FollowCard follow_id={item3}/>)}
    } 
    
    const map=[null,article_list,video_list,collect_list,follow_list];
    var content=map[this.state.hove];
    
    return (<div id='show' style={{
        width: 760,
        height: 'auto',
        margin: '60px auto',
        padding: 0,
        textAlign: 'left',  
      }}>
      <div style={{width:'100%',height:300,background:'#ffffff ',border:'#80808038 1px solid',margin:'20px auto'}}>
      <div style={{float:'left',margin:'40px'}}><img src={this.state.image} alt='' style={{
        width: 200,
        height: 200
      }}/></div>
      <div style={{float:'left',margin:'80px 20px',padding:10}}>
      <div ><h2>{this.state.name}</h2></div>
      
      <div><h2>{this.state.school}</h2></div>
     </div>
      {/* <div style={{float:'right',margin:'10px 10px'}}>修改头像：</div><Avatar name={this.state.name} user_id={this.state.user_id} get={this.get} update={this.update}/>
      */}
      </div>
      <div style={{width:'100%',height:'auto',background:'#ffffff ',border:'#80808038 1px solid',margin:'20px auto'}}>
       <div style={{height:60,borderBottom:'#80808038 1px solid',lineHeight:'15px'}}>
       <div id='my1' style={put} onClick={this.chose.bind(this,1)}>文章</div>
        <div id='my2' style={put} onClick={this.chose.bind(this,2)}>课程</div>
        <div id='my3' style={put} onClick={this.chose.bind(this,3)}>收藏</div>
        <div id='my4' style={put} onClick={this.chose.bind(this,4)}>关注</div>
        </div>
        <div> {content}  </div>
      </div>
    </div>)
  }
}

const Edit =props=>{
   
  return(<div style={{width:'100%',height:800,marginTop:60}}>
      <div style={{width:'800px',height:600,margin:'auto',background:'#ffffff',textAlign:'center',padding:150}}>
          <div style={{}}><Avatar name={props.name} user_id={props.user_id}/></div>
          <div style={{margin:50,color:'black',fontSize:20}}>用户名：<input className='user-name' type='text' style={{border:'#80808038 1px solid',width:200,height:25,borderRadius: 5,outline:'none',padding: 5,background:'#cecccc40',fontSize:14}} defaultValue={props.name} onChange={(e)=>getname(e.target.value)}/></div>
          <div style={{margin:50,color:'black',fontSize:20}}>学校：<input className='user-school' type='text' style={{border:'#80808038 1px solid',width:200,height:25,borderRadius: 5,outline:'none',padding: 5,background:'#cecccc40',fontSize:14}} defaultValue={props.school} onChange={(e)=>getschool(e.target.value)}/></div>
          <Button onClick={()=>xiu(props.user_id)}>确定</Button>
      </div>
  </div>)

}
class Avatar extends Component {
constructor() {
super();
this.state = {
  loading: false
}
this.getBase64 = this.getBase64.bind(this);
this.beforeUpload = this.beforeUpload.bind(this);
this.handleChange = this.handleChange.bind(this);
this.onSubmit = this.onSubmit.bind(this);
}

getBase64(img, callback) {
const reader = new FileReader();
reader.addEventListener('load', () => callback(reader.result));
reader.readAsDataURL(img);
}

beforeUpload(file) {
const isJPG = file.type === 'image/jpeg';
if (!isJPG) {
  message.error('You can only upload JPG file!');
}
const isLt2M = file.size / 1024 / 1024 < 2;
if (!isLt2M) {
  message.error('Image must smaller than 2MB!');
}
return isJPG && isLt2M;
}
handleChange = (info) => {
if (info.file.status === 'uploading') {
  this.setState({loading: true});
  return;
}
if (info.file.status === 'done') {
  // Get this url from response in real world.
  this.getBase64(info.file.originFileObj, imageUrl => this.setState({imageUrl, loading: false}));
}
}
getData(user_id) { //请求数据函数

fetch("http://127.0.0.1:8000/userinfo/" + user_id, {
  method: 'GET',
  headers: {
    'content-type': "application/json" //json格式
  },
  mode: 'cors'
}).then(response => response.json()).then(data => { //data数据处理

  var image = data['userimages'];
  this.props.get(image);
}).then(response => response, error => error);

}
onSubmit() {
this.getData(this.props.user_id);
this.props.update('true')
}
render() {
const uploadButton = (<div>
  <Icon type={this.state.loading
      ? 'loading'
      : 'plus'}/>
  <div className="ant-upload-text">修改我的头像</div>
</div>);
const imageUrl = this.state.imageUrl;
var url='';
var button= '';


 url = "http://127.0.0.1:8000/upload/image?kind=avator";
 button= <Button htmlType="submit" onClick={this.onSubmit} type="primary">确定</Button> ;

return (<div>
  <Upload name="img" listType="picture-card" className="avatar-uploader" showUploadList={false} action={url} beforeUpload={this.beforeUpload} onChange={this.handleChange} withCredentials={true}>
    {
      imageUrl
        ? <img src={imageUrl} alt="avatar" style={{
              width: 200,
              height: 200
            }}/>
        : uploadButton
    }
  </Upload>
  {/*<div>*/}
  {/*  {button}*/}
  {/*</div>*/}
</div>);
}
}
const getname=(e)=>{
  $('.user-name').val(e);
}
const getschool=(e)=>{
  $('.user-school').val(e);
}
const xiu=(e)=>{
  const user_id=e;
  const name= $('.user-name').val();
  const school=$('.user-school').val();
  var messages={user_id:user_id,name:name,school:school}
  fetch("http://127.0.0.1:8000/edit", {
      method: 'POST',
      credentials:"include",
      headers: {
          'content-type': "application/json" //json格式
      },
      mode: 'cors',
      body:JSON.stringify(messages)
  }).then(response => response.json()).then(data => { //data数据处理
      if(data['message']==="update successfully"){
          message.success('修改成功！');
          
      }
      else{
          message.error('修改失败！');
      }

  }).then(response => response, error => error);
}
export default Home;