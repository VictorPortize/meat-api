import * as restify from 'restify'
import {NotAuthorizedError} from 'restify-errors'
import { User } from '../users/users.model'
import { environment } from '../common/environment'
import * as jwt from 'jsonwebtoken'

export const authenticate: restify.RequestHandler = (req, resp, next)=>{
    const {email, password} = req.body
    console.log(req)
    User.findByEmail(email, '+password')
      .then(user=>{
        if(user && user.matches(password)){
          const token = jwt.sign({sub: user.email, iss: 'meat-api'},
                    environment.security.apiSecret)
          resp.json({name: user.name, email: user.email, accessToken: token})
          return next(false)
        } else {
          return next(new NotAuthorizedError('Invalid Credentials'))
        }
    }).catch(next)
  }