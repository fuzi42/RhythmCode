import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import HelloWorld from './App';
import ImageCode from './huadong';
import {hashHistory} from 'react-router-dom'
import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Modal,
  Upload,
  message,
  Cascader,
  notification
} from 'antd';
import moment from 'moment';
import image from './images/timg.jpg'
import image4 from './images/20.jpg'
import image1 from './images/9.jpg'
import image2 from './images/14.png'
import image3 from './images/15.png'
import {stringify} from 'querystring';

class Home extends Component {
  state = {
    hov: false,
    token: ''
  }
  hover = () => {
    this.setState({hov: true});

  }
  zhuan = (token) => {
    if (token !== '') {
      this.props.history.push({
        pathname: '/home',
        state: {
          token: token
        }
      });
    }

  }
  render() {
    const body = {
      width: '100%',
      height: '100%',
      background: 'url(' + image + ')',
      overflow: 'hidden'
    }
    var use = {
      width: 0,
      background: '#f9b7b7d9',
      margin: '40px auto ',
      padding: '10px 10px',
      borderRadius: 10,
      visibility: 'hidden',
      transition: 'width 2s, height 1s, visibility 5s, transform 2s'

    }
    if (this.state.hov) {
      use.visibility = 'visible';
      use.width = '30%';
      use.transform = 'rotateY(360deg)'
    }
    return (<div style={body} onMouseEnter={this.hover}>
      <div style={use}>
        <WrappedNormalLoginForm token={this.zhuan}/>
      </div>
    </div>)

  }
}

class NormalLoginForm extends React.Component { //登录界面
  state = {
    token: '',

    visible: false,
    confirmLoading: false
  }
  handleSubmit = (e) => {

    e.preventDefault();
    this.props.form.validateFields((err, values) => {

      if (!err) {
        console.log('Received values of form: ', values);
        this.showModal();
        fetch("http://112.74.38.93:8080/denglu/" + values['userName'] + '&' + values['password'], {
          method: 'GET',

          headers: {
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        }).then(response => response.json()).then(data => { //data数据处理

          if (data['datas'] === 'successfully') {
            const token = data['token'];
            this.setState({token: token})
            //this.props.token(this.state.token)
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
      this.props.token(this.state.token)
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
        <h1>欢迎来到校园墙</h1>
        <img src={image1} alt='' style={{
            width: '90%',
            height: 150,
            margin: '10px 2px'
          }}></img>
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
      fetch("http://112.74.38.93:8080/zhuce/" + name + '&' + password + '&' + school, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET',
        mode: 'cors'
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
