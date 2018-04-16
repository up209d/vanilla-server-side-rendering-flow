import React from 'react';

const Login = props => (
  <div>
    <h1>LOGIN PAGE</h1>
    <form method={'POST'} action={'/auth'}>
      <input type={'text'} name={'user'} placeholder={'enter username'}/>
      <input type={'password'} name={'pwd'} placeholder={'enter password'}/>
      <input type={'submit'} name={'submit'}/>
    </form>
  </div>
);

export default Login;