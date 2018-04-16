import jwt from 'jsonwebtoken';
import hostConfig from 'host.config';

import serverStorage from './server.storage';

export function authentication(req, res) {
  // Database check (bcrypt user/password matching)
  let user = serverStorage.checkAuthentication(req.body.user, req.body.pwd);
  if (user) {
    // Assign user to current session (later we can compare with token user)
    // This also save the session automatically (Or we can use req.session.save())
    // then reset the maxAge of current Session and Cookie to keep in sync with next comming jwt
    // By option rolling: true, each time the session is saved, its maxAge will be reset
    req.session.users = Object.assign({}, req.session.users, {
      [req.body.user]: {
        // username | user email as id
        id: req.body.user,
        // ip address as client address
        address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        // client user agent for further checking
        agent: req.headers['user-agent']
      }
    });

    // Add session to user database
    serverStorage.addSessionToUser(
      req.body.user,
      req.session,
      hostConfig.globalMaxAge,
      function (user, session) {
        console.log(user + ' with ' + session + ' session has been expried!!!');
      }
    );

    // Generate a token with user information (payload)
    let token = jwt.sign({
      name: user.name,
      session: req.session.id
    }, hostConfig.secret, {
      algorithm: 'HS256',
      expiresIn: hostConfig.globalMaxAge + 'ms',
      notBefore: '1s'
    });

    // Send token out as a response
    return res
      .cookie('token',token,{
        maxAge: hostConfig.globalMaxAge,
        httpOnly: true
      })
      .status(200)
      .json({
        message: res.statusCode + ': You passed!!!',
        session: req.session.id,
        token
      });
  }
  // Otherwise, send failed message
  return res.status(401).json({
    message: res.statusCode + ': Incorrect user/password!!!',
    session: req.session.id
  });
}

export function checkAuthentication(req, res) {
  // Check whether req.session.user is matched with token user (req.user)
  if (
    // jwt session check
  req.session.id === req.user.session &&
  // session store check
  !!req.session.users &&
  !!req.session.users[req.user.name] &&
  // database check whether session is attached to user
  !!serverStorage.isSessionRegistered(req.user.name, req.session.id)
  ) {
    res.status(200).json({
      message: res.statusCode + ': You have passed!!!',
      user: req.session.users[req.user.name],
      session: req.session.id
    });
  } else {
    res.status(401).json({
      message: res.statusCode + ': You have failed, token is not matched with current session!!!',
      session: req.session.id
    });
  }
}

export default {
  authentication,
  checkAuthentication
}