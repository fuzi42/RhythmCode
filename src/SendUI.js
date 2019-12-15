import React, { Component } from "react";
import {
    Icon,
    Button,
    Upload,
    message,
    TreeSelect,
  } from 'antd';
import $ from 'jquery';
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'
import subscript from 'markdown-it-sub'
import superscript from 'markdown-it-sup'
import footnote from 'markdown-it-footnote'
import deflist from 'markdown-it-deflist'
import abbreviation from 'markdown-it-abbr'
import insert from 'markdown-it-ins'
import mark from 'markdown-it-mark'
import tasklists from 'markdown-it-task-lists'
import http from './Http'
// -------------------------------------
//发布页面
const Home =props=>{    
       const send_id= props.match.params.send_id.substring(0,5);
       var content_id='';
      
          content_id=props.match.params.send_id.substring(6);
          console.log(send_id,content_id)
        var tap={
          'senda':[<SendArt user_id={props.user_id} />,'写文章'],
          'sendv':[<SendVid user_id={props.user_id} />,'发课程'],
          'edita':[<SendArt user_id={props.user_id} article_id={content_id}/>,'改文章'],
          'editv':[<SendVid user_id={props.user_id} video_id={content_id}/>,'改课程'],
        };
     var tap_dom= tap[send_id];
     console.log(tap_dom)
    const tap_child=tap_dom[0];
    const tap_title=tap_dom[1];
        return(
            <div style={{width: '100%' ,height: 'auto', background: '#ffffff',top:0,}}>
        <div id='top' style={{position:'absolute',top:0,left:0}} ></div>
              <div id='fixed' style={{width: '100%' ,height: 60,background: '#ffffff',color: 'black',position:'fixed',top:0,borderBottom:'#80808066 1px solid'}}>
                 <div style={{width: '1000px' ,height: 60,margin:'auto',padding:5, lineHeight: '50px'}}> 
                      <a href='/ahome' style={{fontSize: 30 ,color:'#0142ff',margin: 'auto 10px',float:'left',textDecoration:'none' }} >TSTE</a>
                    <h3 style={{width:80,fontWeight:900,float:'left',margin:0,textAlign:'center',borderLeft:'1px #80808042 solid'}}>{tap_title}</h3>
                     
                 </div>
              </div>
          {tap_child}
        </div>
        )
}

class SendArt extends Component{
  mdParser = null
    constructor(){
      super()
      this.state={title: '',data:'',title_image:'',imageUpdate:false,loading:false}
      this.send=this.send.bind(this);
      this.gettitle=this.gettitle.bind(this)
      this.mdParser = new MarkdownIt({
        html: true,
      linkify: true,
      typographer: true,

      }).use(emoji)
    .use(subscript)
    .use(superscript)
    .use(footnote)
    .use(deflist)
    .use(abbreviation)
    .use(insert)
    .use(mark)
    .use(tasklists, { enabled: this.taskLists })
    // this.renderHTML = this.renderHTML.bind(this)
    }
    componentWillMount(){
      if(this.props.article_id){
        http.get("http://127.0.0.1:8000/show?card="+this.props.article_id 
        ).then(data => { //data数据处理
          const title = data['cards']['title'];
          var message = data['cards']['message'];
          var picture='';
        if(data['cards']['image']!=='' && data['cards']['image']!==null ){
            picture =data['cards']['image']
          }
         
          this.setState({title:title,data:message,title_image:picture});
          
        }).then(response => response, error => error);
      }
    }
   componentDidMount(){
    $('#fixed').css('position','relative')
     console.log(this.props.user_id)
   }
    
    send(){
      if(this.mdEditor && this.mdEditor.getHtmlValue()){
        const text=this.mdEditor.getHtmlValue();
        var title_image = this.state.title_image.split('/').pop()
        var data={message:text,title:this.state.title,image:title_image};
        console.log(title_image)
        if(this.state.imageUpdate){
          data.image=this.state.title_image
        }
        var url='send';
      if(this.props.article_id){
         data.article_id=this.props.article_id;
         url='edit?card='+this.props.article_id;
      }
      
     fetch("http://127.0.0.1:8000/"+url , {
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-type': "application/json" //json格式
        },
        mode: 'cors',
        body: JSON.stringify(data)
      }).then(response => response.json()).then(data => { //data数据处理
        
        if(data['message']==="发布成功！" || data['message']==="修改成功！"){
          message.success(data['message']);
          setTimeout(function(){
            window.location.href='/ahome/'
          },2000)
        }
      }).then(response => response, error => error);
    }
    }
    handleEditorChange ({html, text}) {}
    handleImageUpload(file, callback) {
      const reader = new FileReader();
     
      reader.onload = () => {      
        const convertBase64UrlToBlob = (urlData) => {  
          let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1]
          let bstr = atob(arr[1])
          let n = bstr.length
          let u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          return new Blob([u8arr], {type:mime})
        }
        const blob = convertBase64UrlToBlob(reader.result) ; 
          setTimeout(() => {
          var data =new FormData();
          data.append('img',file)
           fetch("http://127.0.0.1:8000/upload/image?kind=article", {
             method: 'POST',
             credentials: 'include',
             mode: 'cors',
             body: data
           }).then(res=>res.json().then(data=>{
              if(data==="上传成功！"){
                callback("http://127.0.0.1:8000/images/"+file.name)
              } 
            }))
          
         }, 1000)
      }
      reader.readAsDataURL(file)
    }
    gettitle(event) {
      this.setState({title: event.target.value})
    
  }
   getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
   beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          title_image:info.file.name,
          loading: false,
          imageUpdate:true,
        }),
      );
    }
  };
    render(){  
      var MOCK_DATA = "Hello.\n\n * This is markdown.\n * It is fun\n * Love it or leave it."
      if(this.props.article_id){MOCK_DATA=this.state.data}              
     const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传题图</div>
      </div>
    );
    const { imageUrl } = this.state;
    var title_image='';
    if(this.props.article_id){
      title_image=imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : <img src={this.state.title_image} alt="avatar" style={{ width: '100%' }} />
    }else{
      title_image=imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton
    }
      return(<div style={{width:800,height:'auto',margin:'auto'}}>
        <div style={{width:'100%',height:'auto',background: '#ffffff',margin:'auto',border:'none',padding:50}}>
          
           <div style={{margin:'10px auto'}}>
             <div style={{fontSize:16,color:'black'}}></div>
             <div style={{}}> <Upload
        name="img"
        listType="picture-card"
        className="avatar-uploader"
        withCredentials={true}
        showUploadList={false}
        action="http://127.0.0.1:8000/upload/image?kind=article"
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
      >
      {title_image}
      </Upload></div>
          </div>
          <div style={{margin:'10px auto'}}>标题：<input type='text' style={{border:'#80808038 1px solid',width:500,height:25,borderRadius: 5,outline:'none',padding: 5,background:'#cecccc40'}} value={this.state.title} onChange={this.gettitle}/></div>
          <MdEditor
           ref={node => this.mdEditor = node}
           value={MOCK_DATA}
           style={{height: '400px'}}
          //  renderHTML={this.renderHTML}
          renderHTML={(text) => this.mdParser.render(text)}
           config={{
             view: {
               menu: true,
               md: true,
               html: true
             },
             
           }}
           onChange={this.handleEditorChange} 
           onImageUpload={this.handleImageUpload}
         />
        <div style={{margin:'20px auto'}}><Button >保存</Button></div>
        <div><Button onClick={this.send}>发布</Button></div>
        </div>
       
        
      </div>)
    }
  }
  
class SendVid extends Component{ 
    constructor(){
      super()
      this.state={title: '',message:'',video_url:'',videoUpdate:false,value:""}
      this.gettitle=this.gettitle.bind(this);
      this.getmessage=this.getmessage.bind(this);
      this.send=this.send.bind(this);
    }
    componentWillMount(){
      if(this.props.video_id){
        http.get("http://127.0.0.1:8000/show?card="+this.props.video_id 
        ).then(data => { //data数据处理
          const title = data['cards']['title'];
          const message = data['cards']['message'];
          const video_url = data['cards']['video'];
          this.setState({title:title,message:message,video_url:video_url});
          
        }).then(response => response, error => error);
      }
    }
  componentDidMount(){
    $('#fixed').css('position','relative')
  }
    gettitle(event) {
        this.setState({title: event.target.value})
      
    }
    getmessage(event) {
      this.setState({message: event.target.value})
    }
    send(){
      var video_url = this.state.video_url.split('/').pop()
      var data={user_id:this.props.user_id,title:this.state.title, message: this.state.message,video:video_url,kind:this.state.value}
      if(this.state.videoUpdate){
        data.video = this.state.video_url
      }
      var url='send'
      if(this.props.video_id){
        data.video_id=this.props.video_id;
        url='edit?card='+this.props.video_id;
     }
      fetch("http://127.0.0.1:8000/"+url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-type': "application/json" //json格式
        },
        mode: 'cors',
        body: JSON.stringify(data)
      }).then(response => response.json()).then(data => { //data数据处理
                if(data['message']==="发布成功！" || data['message']==="修改成功！"){
                  message.success(data['message']);
                  setTimeout(function(){
                    window.location.href='/ahome/'
                  },2000)
                  
                }
                else{
                  message.error('发布失败！')
                }
      }).then(response => response, error => error);
    }
    onChange=info=>{
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        this.setState({video_url:info.file.name,videoUpdate:true})
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
    onChangeText = value => {
      console.log(value);
      this.setState({ value });
    };
  
    render(){
      const { TreeNode } = TreeSelect;
      const Dragger = Upload.Dragger;
  
  const props = {
    name: 'vid',
    multiple: false,
    accept:".mp4",
    action: 'http://127.0.0.1:8000/upload/media',
    withCredentials: true
  };
  
      return(<div style={{width:800,height:800 ,margin:'auto',}}>
          <div style={{width:800,height:'100%',background: '#ffffff',margin:'auto',border:'none',padding:50}}>
          <TreeSelect 
        showSearch
        style={{ width: '100px' }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="添加标签"
        allowClear
        // multiple
        treeDefaultExpandAll
        onChange={this.onChangeText}
      >
        <TreeNode value="Python" title="Python" key="0-1" />
        <TreeNode value="Java" title="Java" key="0-2" />
        <TreeNode value="C++" title="C++" key="0-3" />
        <TreeNode value="GO" title="GO" key="0-4" />  
      </TreeSelect>
           <div style={{margin:'10px auto',marginTop:30}}>标题：<input type='text' style={{border:'#80808038 1px solid',width:500,height:25,borderRadius: 5,outline:'none',padding: 5,background:'#cecccc40'}} value={this.state.title} onChange={this.gettitle}/></div>
           <div style={{margin:'10px auto'}}> 描述：<br/><textarea style={{border:'#80808038 1px solid',width:500,height:200,margin:'auto 40px',borderRadius:5,outline:'none',resize:'none',padding: 5,background:'#cecccc40'}} value={this.state.message} onChange={this.getmessage}/></div>
           <div style={{margin:'10px auto'}}> 视频上传：<br/><br/><Dragger {...props} onChange={this.onChange}>
      <p className="ant-upload-drag-icon">
        <Icon type="inbox" />
      </p>
      <p className="ant-upload-text">点击上传</p>
      <p className="ant-upload-hint">
       或将文件拖至此处上传
      </p>
    </Dragger>,
    </div>
        <div ><Button onClick={this.send}>发布</Button></div>
          </div>
      </div>)
    }
  }

export default Home;