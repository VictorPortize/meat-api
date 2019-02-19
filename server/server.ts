import * as restify from 'restify'
import * as mongoose from 'mongoose'

import {environment} from '../common/environment'
import {Router} from '../common/router'
import {mergePatchBodyparser} from './merge-path.parser'
import {handlerError} from './error.handler'

export class Server {

    application: restify.Server

    initializeDb(){
        return mongoose.connect(environment.db.url, {
            useNewUrlParser: true
        })
    }

    initRoutes(routers: Router[]): Promise<any>{
        return new Promise((resolve, reject)=> {
            try{
            
                this.application = restify.createServer({
                    name:'meat-api',
                    version:'1.0.0',
                })

                //routes
                for (let router of routers){
                    router.applyRoutes(this.application)
                }

                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(mergePatchBodyparser)

                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                })
                
                this.application.on('restifyError', handlerError)

            }catch(error){
                reject(error)
            }
        })
    }

    bootstrap(routers: Router[] = []): Promise<Server>{
        return this.initializeDb().then(() => 
        this.initRoutes(routers).then(() => this))
    }

    shutdown(){
        return mongoose.disconnect().then(() => this.application.server.close())
    }

}