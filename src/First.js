import React, { Component } from "react";
import ImageCode from './huadong';
import './antd.css';
import "./animate.min.css";
import Typed from "../node_modules/typed.js/src/typed";
import {
    Form,
    Icon,
    Input,
    Button,
    Checkbox,
    Modal,
    Cascader,
    notification
  } from 'antd';
import image from './images/bg.jpg'
import image4 from './images/20.jpg'
import image1 from './images/9.jpg'
import image2 from './images/14.png'
import image3 from './images/15.png'

const Home =()=>{
  var decodedCookie = decodeURIComponent(document.cookie);
  if (decodedCookie) { 
      window.location.href='/ahome/'
    }
          const body = {
            width: '100%',
            height: '100%',
            background: 'url(' + image + ')',
            overflow: 'hidden',
            backgroundSize: '100% 100%'
          }
          var use = {
            width: '30%',
            background: '#d7d9d9e3',
            margin: '8% auto ',
            padding: '10px 10px',
            borderRadius: 10,
          }        
          return (<div style={body} >
            <div className="animated flipInX slow " style={use}>
              <WrappedNormalLoginForm />
            </div>
          </div>)
}
      
      class NormalLoginForm extends React.Component { //登录界面
        state = {
          user_id: '',
      
          visible: false,
          confirmLoading: false
        }
        componentDidMount() {
            fetch("https://v1.hitokoto.cn/?c=f&encode=text ", {
              method: "GET",
              headers: {},
              mode: "cors"
            })
              .then(response => response.text())
              .then(data => {
                //data数据处理
        
                console.log(data);
                var strings = [];
                strings.push(data);
                var typed = new Typed("#a", {
                  strings: strings,
                  typeSpeed: 100
                });
              })
              .then(response => response, error => error);
          }
          
        handleSubmit = (e) => {
      
          e.preventDefault();
          this.props.form.validateFields((err, values) => {
      
            if (!err) {
              console.log('Received values of form: ', values);
  //登录成功，设置cookie
              var d = new Date();
             // d=d.split(',');  
              d.setTime(d.getTime() + (1*24*60*60*1000));
              var expires = d.toUTCString();                           
              var userlogin={'name':values['userName'],'password':values['password']};
              fetch("http://127.0.0.1:8000/denglu" , {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json'
                },
                mode: 'cors',
                body:JSON.stringify(userlogin)
              }).then(response => response.json()).then(data => { //data数据处理
      
                if (data['message'] === '登录成功！') {
                  const token = data['token'];
                  // document.cookie = 'denglu='+token+','+expires + ";path=/;";
                  this.showModal();
                  //this.props.user_id(this.state.user_id)
                } else {
                  alert(data['datas'] + '：密码错误或用户名错误');
                }
              }).then(response => response, error => error);
            }
          });
        }
        showModal = () => {
          this.setState({visible: true});
        }
      
        handleOk = () => {
          this.setState({confirmLoading: true});
          setTimeout(() => {
            this.setState({visible: false, confirmLoading: false});
          }, 2000);
        }
      
        handleCancel = () => {
          console.log('Clicked cancel button');
          this.setState({visible: false});
        }
        success = (e) => {
          if (e) {
           window.location.href='/ahome/'
          }
        }
        render() {
          const {visible, confirmLoading} = this.state;
          const {getFieldDecorator} = this.props.form;
          return (<div>
            <div style={{
                padding: 10,
                margin: 'auto',
                textAlign: 'center'
              }}>
              <img src={image2} alt='' style={{
                  width: '90%',
                  height: 80
                }}/>
              <h1 style={{color:'#313ab5bf'}}>TSTE</h1>
              
            </div>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item>
                {
                  getFieldDecorator('userName', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your username!'
                      }
                    ]
                  })(<Input prefix={<Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)' }}/>} placeholder="Username"/>)
                }
              </Form.Item>
              <Form.Item>
                {
                  getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your Password!'
                      }
                    ]
                  })(<Input prefix={<Icon type = "lock" style = {{ color: 'rgba(0,0,0,.25)' }}/>} type="password" placeholder="Password"/>)
                }
              </Form.Item>
              <Form.Item>
                {
                  getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true
                  })(<Checkbox>Remember me</Checkbox>)
                }
      
                <div style={{
                    float: 'right',
                    marginRight: 20
                  }}>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    登录
                  </Button>
                </div>
                <Zhuce/>
      
              </Form.Item>
            </Form>
            <div id="a" style={{height:50, textAlign: 'center'}}/>
            <img src={image3} alt='' style={{
                width: '98%',
                height: 80
              }}/>
            <Modal visible={visible} footer='' onCancel={this.handleCancel}>
              <div style={{
                  width: '100%',
                  height: '100%',
                  margin: '10px auto'
                }}><App success={this.success}/></div>
            </Modal>
          </div>);
        }
      }
      class App extends Component {
        state = {
          url: ""
        }
      
        componentDidMount() {
          this.setState({url: image4})
        }
      
        onReload = () => {
          this.setState({url: image1})
        }
        render() {
          return (<div>
            <ImageCode imageUrl={this.state.url} onReload={this.onReload} onMatch={() => {
                console.log("code is match");
                this.props.success(true)
              }}/>
          </div>)
        }
      }
      
      class Zhuce extends Component { //注册
        state = {
          visible: false,
          name: '',
          password: '',
          school: ''
        }
      
        showModal = () => {
          this.setState({visible: true});
        }
        handelChange1 = (e) => {
          this.setState({name: e.target.value})
        }
        handelChange2 = (e) => {
          this.setState({password: e.target.value})
        }
      
        handleOk = () => {
          const school = this.state.school;
          const name = this.state.name;
          const password = this.state.password;
          if (name === '' || password === '') {
            alert('用户名或密码或不能为空！')
          } else if (school === '') {
            alert('学校不能为空!')
          } else {
            fetch("http://127.0.0.1:8000/zhuce", {
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'GET',
              mode: 'cors',
              body: JSON.stringify({name:name,password:password,school:school})
            }).then(response => response.json().then(json => ({json, response}))).then(({json, response}) => {
              if (!response.ok) {
                return Promise.reject(json);
              };
      
              notification.success({message: '注册成功！'});
      
              return json;
            }).then(response => response, error => error);
            setTimeout(() => {
              this.setState({visible: false, name: '', password: '', school: ''});
            }, 1000);
          }
        }
        handleCancel = () => {
          console.log('Clicked cancel button');
          this.setState({visible: false, name: '', password: ''});
        }
      
        onChange = (value) => {
          this.setState({school: value[2]})
          console.log(value[2]);
        }
      
        // Just show the latest item.
        displayRender = (label) => {
          return label[label.length - 1];
        }
        render() {
          const options = [
            {
              value: 'zhejiang',
              label: '四川省',
              children: [
                {
                  value: 'hangzhou',
                  label: '南充市',
                  children: [
                    {
                      value: 'xihu',
                      label: '西华师范大学'
                    }, {
                      value: 'xihu1',
                      label: '西华师范大学1'
                    }
                  ]
                }
              ]
            }, {
              value: 'jiangsu',
              label: 'Jiangsu',
              children: [
                {
                  value: 'nanjing',
                  label: 'Nanjing',
                  children: [
                    {
                      value: 'zhonghuamen',
                      label: 'Zhong Hua Men'
                    }
                  ]
                }
              ]
            }
          ];
          const {visible, confirmLoading} = this.state;
      
          return (<div>
            <div style={{
                float: 'right',
                marginRight: 20
              }}>
              ---><Button type="primary" onClick={this.showModal}>
                去注册
              </Button>
            </div>
            <Modal title="注册" visible={visible} onOk={this.handleOk} confirmLoading={confirmLoading} onCancel={this.handleCancel}>
              <div style={{
                  margin: 'auto'
                }}></div>
              <div >
                昵称：<Input value={this.state.name} prefix={<Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)' }}/>} onChange={this.handelChange1} placeholder="Username"/>
                密码：<Input value={this.state.password} prefix={<Icon type = "lock" style = {{ color: 'rgba(0,0,0,.25)' }}/>} onChange={this.handelChange2} type="password" placeholder="Password"/> {/* 学校：<Input value={this.state.school} prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.handelChange3}  placeholder="YourSchool" /> */}
                学校：<br/>
                <Cascader options={options} expandTrigger="hover" displayRender={this.displayRender} onChange={this.onChange}/>,
              </div>
            </Modal>
          </div>
          ) } } const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(NormalLoginForm);

  
      export default Home ;
      