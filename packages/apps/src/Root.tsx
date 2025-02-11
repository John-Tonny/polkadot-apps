// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeDef } from '@polkadot/react-components/types';
import type { KeyringStore } from '@polkadot/ui-keyring/types';

import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { ApiCtxRoot } from '@polkadot/react-api';
import { ApiStatsCtxRoot, BlockAuthorsCtxRoot, BlockEventsCtxRoot, KeyringCtxRoot, QueueCtxRoot, WindowSizeCtxRoot } from '@polkadot/react-hooks';
import { settings } from '@polkadot/ui-settings';

import Apps from './Apps.js';

import { styled } from '@polkadot/react-components';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Layout, Image } from 'antd';
import axios from 'axios';

const { Content, Sider } = Layout;

// import logo from './logo.jpeg';
import { chainsTtPNG, chainsLogoJPEG } from '@polkadot/apps-config/ui/logos/chains/index.js';

interface Props {
  isElectron: boolean;
  store?: KeyringStore;
}

function createTheme ({ uiTheme }: { uiTheme: string }): ThemeDef {
  const theme = uiTheme === 'dark'
    ? 'dark'
    : 'light';

  document?.documentElement?.setAttribute('data-theme', theme);

  return { theme };
}

function Root ({ isElectron, store }: Props): React.ReactElement<Props> {
  const [theme, setTheme] = useState(() => createTheme(settings));

  const [logined, setLogined] = useState(sessionStorage.getItem('login') != null);
  const [account, setAccount] = useState();
  const [password, setPassword] = useState();
  
  // sessionStorage.removeItem('login'); 
  const onFinish = (values: any) => {
    if(false){
      if (account == 'admin' && password == 'jlw@999000') {
        setLogined(true);
      } else {
        alert('无效的用户名和密码！');
      }
    }else{
      const data = {
        email: account,
        password: password,
      };
	
      console.log(data);
      axios.post('http://116.196.93.236:9090/api/auth/login', data)
      .then(response => {
        if(response.data.status == 200 && response.data  && response.data.status == 200 ){
	  sessionStorage.setItem('login', account);
          setLogined(true);
        }else{
          alert(response.data.message);
	}
      })
      .catch(error => {
        alert('无效的用户名和密码！');
      });
    }
  };

  useEffect((): void => {
    settings.on('change', (settings) => setTheme(createTheme(settings)));
  }, []);

  // The ordering here is critical. It defines the hierarchy of dependencies,
  // i.e. Block* depends on Api. Certainly no cross-deps allowed
  return (
    <Suspense fallback='...'>
      <ThemeProvider theme={theme}>
        <QueueCtxRoot>
          <ApiCtxRoot
            apiUrl={settings.apiUrl}
            isElectron={isElectron}
            store={store}
          >
            <KeyringCtxRoot>
              <ApiStatsCtxRoot>
                <BlockAuthorsCtxRoot>
                  <BlockEventsCtxRoot>
                    <HashRouter>
                      <WindowSizeCtxRoot>
                        { logined && (
                          <Apps />
                        )}
                        { !logined && (
                          <StyledDiv>
                            <div className="box">
                              <div className="login-box">
			        <Layout>
      				  <Content>
				    <fieldset className="login-contain">
       				      <div className="container">
                                        <div className="centered-div">
					  <Image width={100} src={chainsTtPNG} preview={false} />
                                          <p></p>
                                          <h>维公区块链运维管理</h>
                                        </div>
                                      </div>
                                      <Form
                                        name="normal_login"
                                        className="login-form"
                                        initialValues={{ remember: true }}
                                        onFinish={onFinish}
                                      >
                                        <Form.Item
                                          name="username"
                                          rules={[{ required: true, message: '请输入用户名!' }]}
                                        >
                                          <Input
                                            prefix={<UserOutlined className="site-form-item-icon" />}
                                            placeholder="用户名"
                                            onChange={ e => setAccount(e.target.value)}
                                          />
                                        </Form.Item>
                                        <Form.Item
                                          name="password"
                                          rules={[{ required: true, message: '请输入密码!' }]}
                                        >
                                          <Input
                                            prefix={<LockOutlined className="site-form-item-icon" />}
                                            type="password"
                                            placeholder="密码"
                                            onChange={ e => setPassword(e.target.value)}
                                          />
                                        </Form.Item>

                                        <Form.Item>
					  <Button type="primary" style={{backgroundColor:'#00a87a'}} htmlType="submit" className="login-form-button">
                                            登录
                                          </Button>
                                        </Form.Item>
                                      </Form>
                                    </fieldset>
      				  </Content>
				  <div className="ant-layout-sider">
      				    <Sider width={600}>
      				    </Sider>
				  </div>
    				</Layout>
			      </div>
			    </div>
                          </StyledDiv>
                        )}
                      </WindowSizeCtxRoot>
                    </HashRouter>
                  </BlockEventsCtxRoot>
                </BlockAuthorsCtxRoot>
              </ApiStatsCtxRoot>
            </KeyringCtxRoot>
          </ApiCtxRoot>
        </QueueCtxRoot>
      </ThemeProvider>
    </Suspense>
  );
}

const StyledDiv = styled.div`
.box{
    height: 100vh; /* Magic here */
    background-size:100% 100%;
    background-color: #fafcfe;;
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.login-box{
    border-radius: 10px;
    margin: 0 auto;
    width: 1030px;
    padding: 25px 35px 20px 35px;
    background: #f9eefe;
    border: 1px solid #eaeaea;
    text-align: left;
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.05);
}
.login-contain{
    padding-top: 0;
    background-color: #f7fbfd;
    border-radius: 5px;
    border: 2px solid #f3f9ff;
    border-image: linear-gradient(#def6ff, #26c2f7) 20 20;
}
.legend {
    margin-left: 7px;
    background-color: #d9d9d9;
    border-radius: 5px;
    width: 122px;
    letter-spacing: 8px;
    font-size: 18px;
    text-align: left;
    text-indent: 13px;
    font-weight: bold;
    color: #2f379b;
}
.login-form {
    padding-top: 10px;
    margin: 0 auto;
    width: 79%;
    height: 100%;
    position: relative;
    border: 1px solid #ffffff;
    max-width: 300px;
}
.login-form-forgot {
    float: right;
}
.ant-col-rtl .login-form-forgot {
    float: left;
}
.login-form-button {
    width: 100%;
}
.container {
 display: flex;
 justify-content: center;
 align-items: center;
}
.centered-div {
 padding: 20px;
}
.ant-layout-sider {
 background-size:cover;
 background-color: #ffffff;
 background-image: url(${chainsLogoJPEG}) !important;
 background-repeat: no-repeat;
 background-position: center -50px;
}
`;




export default React.memo(Root);
