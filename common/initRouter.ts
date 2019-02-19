import { ModelRouter } from './model-router'
import { Restaurant} from '../restaurants/restaurants.model'
import * as restify from 'restify'


class InitRouter extends ModelRouter<any>{

    constructor(){
        super(Restaurant)
    }

    applyRoutes(application: restify.Server){

        application.get('/',(req,resp,next) =>{
            resp.json({
                "Users":{
                    "all":"/users",
                    "find":"/users/{id}"
                },
                "Restaurant":{
                    "all":"/restaurants",
                    "find":"/restaurants/{id}",
                    "menu":"/restaurants/{id}/menu"
                },
                "Review":{
                    "all":"/reviews",
                    "find":"/reviews/{id}"
                }
            })
            return next()
        })
    }
}

export const initRouter = new InitRouter()