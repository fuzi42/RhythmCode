import React from "react";
import {
    Icon
  } from 'antd';
import kecheng from "./images/kecheng.png";
import wenzhang from "./images/wenzhang.png"
import wenda from "./images/wenda.png"
const HomeSendUI =props=>{
  
    var sha={width:90 ,height:80,textAlign:'center',float:'left',margin:'auto 6px',cursor:'pointer'}
    return(
      <div style={{position:"fixed", left:'70%',width: '320px' ,minHeight: '300px',float:'left',background: '#ffffff',border:'#80808038 1px solid',margin:'auto 10px',}}>
      <h3 style={{margin:"auto",textAlign:"center",margin:"20px auto"}}>创作中心</h3>
      <div style={{width: '100%' ,height:80,margin:"auto",marginBottom:"4rem"}}>
     
      <div style={sha} onClick={()=>gotoSend(props.user_id,'v')}><img src={kecheng} style={{width:60,height:60}}/>
      
      <h3>写课程</h3>
      </div>
      <div style={sha} onClick={()=>gotoSend(props.user_id,'a')}><img src={wenzhang} style={{width:60,height:60}}/>
      <h3>写文章</h3>
      </div>
      <div style={sha} ><img src={wenda} style={{width:60,height:60}}/>
      <h3>写问答</h3>
      </div>
      </div>
      <hr style={{opacity:0.5}}/>
  </div>
    )
}
const gotoSend=(user_id,e)=>{     //跳转写文章
  if(!user_id){
    window.location.href='/first/'
  }
  else{
    window.open('/ahome/send'+e+'/');
    }
}
export default HomeSendUI;