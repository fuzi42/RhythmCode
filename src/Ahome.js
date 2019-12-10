import React, { Component } from "react";

import HomeContent from './HomeContent'     //载入主页内容
import HomeTitle from './HomeTitle'
import HomeSend from './HomeSend'
const Home = props => {console.log(props)
  return(<div style={{width: '100%' ,height: 'auto', background: '#cecccc40',top:0}}>
         <HomeTitle user_id={props.user_id} image={props.image}/>
          <div id='put' style={{width: '1000px' ,height:'100%',margin:'70px auto',}}>
          <div style={{width:'100%',height:'100%',marginTop:'70px'}}>
           <HomeContent user_id={props.user_id} user_name={props.name} user_image={props.image} />
           <HomeSend user_id={props.user_id}/>
            </div>
            </div>
        </div>)

}

export default Home; 