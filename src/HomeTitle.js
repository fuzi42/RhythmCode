import React ,{Component }from 'react';
import {
    Icon,
      Menu,
      Dropdown,
  } from 'antd';
  import $ from 'jquery';
  import http from './Http'
  import logo from './images/logo.png'
const HomeTitleUI= props=>{
 console.log(props.user_id)
        var a1={color:'gray',margin: 'auto 20px',textDecoration:'none' }
        var userinfoUrl='/people/'+props.user_id+'/';
        var editUrl='/people/edit/';
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <a href={userinfoUrl}><h4 style={{margin:'0 5px'}} ><Icon type="user" />我的主页</h4></a>
                </Menu.Item>
                <Menu.Item key="1">
                   <a href={editUrl}> <h4  style={{margin:'0 5px'}} ><Icon type="edit" theme="filled" />修改资料</h4></a>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">
                    <h4 style={{margin:'0 5px'}}  onClick={deleteCookie}>退出</h4>
                </Menu.Item>
            </Menu>
        );
        var user_image=<a className="ant-dropdown-link" href="/first" style={{display:'inline-block',color:'black'}}>登录</a>
        if(props.user_id){
            console.log(props.image)
            user_image=<Dropdown overlay={menu} trigger={['click']}><a className="ant-dropdown-link" href="#" style={{display:'inline-block'}}><img id='user-image' src={props.image} alt={props.name} style={{width: 30,height: 30,marginRight:'8px'}}/></a></Dropdown>
        }
        return(
            <div style={{width: '100%' ,height: 'auto', background: '#cecccc40',top:0}}>

            <div id='top' style={{position:'absolute',top:0,left:0}} ></div>
              <div id='fixed' style={{width: '100%' ,height: 60,background: '#ffffff',color: 'black',position:'fixed',zIndex:1000,top:0,borderBottom:'#80808066 1px solid'}}>
                 <div style={{width: '1000px' ,height: 60,marginLeft:'10%',padding:5, lineHeight: '50px'}}>
                      <a href='/ahome' style={{width:150,height:60,overflow:"hidden",margin: 'auto 10px',float:'left',marginTop:"-10px",textDecoration:'none',fontFamily:'monospace'}} ><img src={logo} alt='' style={{height:"auto",width:300}}/></a>
                      <div  style={{width: '700px' ,margin:'auto',float:'left' }} >
                          <a href='#' style={a1} >首页</a>
                          <a href='#' style={a1} >发现</a>
                          <a href='#' style={a1} >话题</a>
                          <input type='text' id="search" style={{width:300,height:30,color:'black',margin: 'auto 10px',padding:10, background: '#cecccc47', outline:'none',border: 'none',borderRadius: 5}}/>
                          <button style={{width:50,height:30,background:'#0084ff',border:'none',color: 'white',borderRadius:5,lineHeight:1}} onClick={search}>搜索</button>
                      </div>
                     <div style={{float:'right',cursor:'pointer'}} >
                        {user_image}
                     </div>
                 </div>
              </div>
              <div id="search_result" style={{visibility:"hidden",zIndex:1000,width:'20%',height:500,background:"#f2f2f8d4",position:"absolute",top:50,margin:"auto",left:540}}>

              </div>
              </div>
        )
}
const search =()=> {
    http.get("http://127.0.0.1:8000/search?search="+$("#search").val()
    ).then(data => { //data数据处理
        $("#search_result").css("visibility","visible")
        for (var i in data["cards"]){
            var url = "/ahome/"+data["cards"][i]["user_id"]+"/"+data["cards"][i]["id"]
            $("#search_result").append("<div style='background:white;margin:20px 0;color:black;width:100%;'><a class='s-result"+i+"'href='"+url+"'>"+data["cards"][i]["title"]+"</a></div>")
        }
    //   this.setState({title:title,message:message,video_url:video_url});

    }).then(response => response, error => error);
}
const getCookie=()=> {
    var name = "denglu=";
    var decodedCookie = decodeURIComponent(document.cookie)
    if (decodedCookie) {
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {

                return c.substring(name.length, c.length);
            }
            else{console.log(c)}
        }
    }
}
const deleteCookie=()=>{
    var date=new Date();
    date.setTime(date.getTime()-10000);
    var cval=getCookie();
    document.cookie= "denglu="+cval+";expires="+date.toGMTString()+';path=/;';
    // window.location.href=window.location.pathname;
    window.location.reload();
}
export default HomeTitleUI;
