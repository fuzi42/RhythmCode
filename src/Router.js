import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import First from './First'
import {Ahome,Send,UserInfo,Content} from './Auth'
const BasicRoute = () => (
    <BrowserRouter>
        <Switch>          {/*顺序不能变动*/}
            <Route path="/first" component={First}/>
            <Route path="/ahome/:id/:content" component={Content}/>   {/*内容路由 */}
            <Route path="/ahome/:send_id/" component={Send}/>   {/* 发布编辑路由*/}
            <Route path="/ahome/" component={Ahome}/>       {/*首页路由 */}
            <Route path="/people/:user_id" component={UserInfo}/>  {/*用户信息界面路由 */}
        </Switch>
     </BrowserRouter>
);
export default BasicRoute;
