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
      <div style={{position:"fixed", left:'70%',width: '22%',minWidth:320,minHeight: '300px',float:'left',background: '#ffffff',border:'#80808038 1px solid',margin:'auto 10px',}}>
      <h3 style={{margin:"auto",textAlign:"center",margin:"20px auto"}}>创作中心</h3>
      <div style={{width: '320px' ,height:80,margin:"auto",marginBottom:"4rem"}}>
     
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
      <h3 style={{margin:"auto",textAlign:"center",margin:"20px auto"}}>热门标签</h3>
      <div>
      <div  style={{width:'auto',padding:'10px 15px',background:'#80808069',borderRadius:'8px',margin:'15px',float:'left'}}>架构</div>
      <div  style={{width:'auto',padding:'10px 15px',background:'#80808069',borderRadius:'8px',margin:'15px',float:'left'}}>开源</div>
      </div>
      <div>
      <div  style={{width:'auto',padding:'10px 15px',background:'#80808069',borderRadius:'8px',margin:'15px',float:'left'}}>算法</div>
      <div  style={{width:'auto',padding:'10px 15px',background:'#80808069',borderRadius:'8px',margin:'15px',float:'left'}}>Github</div>
      </div>
      <div>
      <div  style={{width:'auto',padding:'10px 15px',background:'#80808069',borderRadius:'8px',margin:'15px',float:'left'}}>python</div>
      <div  style={{width:'auto',padding:'10px 15px',background:'#80808069',borderRadius:'8px',margin:'15px',float:'left'}}>C++</div>
      <hr   style={{position:'relative',top:180,marginBottom:200,opacity:0.5}} />
      </div>
      <h3 style={{margin:"auto",textAlign:"center",margin:"20px auto"}}>今日推荐</h3>
      <div style={{fontSize:'14px',fontWeight:'800',margin:'20px 0',display:'flex',marginRight:10}}><img  src= {wenda}  style={{width:100,height:60,margin:'0 10px'}}/><p>python 关于地铁乘客出行规划数据分析</p></div>
      <div style={{fontSize:'14px',fontWeight:'800',margin:'20px 0',display:'flex',marginRight:10}}><img  src= {wenda}  style={{width:100,height:60,margin:'0 10px'}}/><p>python 关于地铁乘客出行规划数据分析</p></div>
      <div style={{fontSize:'14px',fontWeight:'800',margin:'20px 0',display:'flex',marginRight:10}}><img  src= {wenda}  style={{width:100,height:60,margin:'0 10px'}}/><p>python 关于地铁乘客出行规划数据分析</p></div>
      
      

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