import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'
import { Restaurant } from './restaurants.model'


class RestaurantsRouter extends ModelRouter<Restaurant>{
    constructor(){
        super(Restaurant)
    }

    envelope(document){
        let resource = super.envelope(document)
        resource._links.menu = `${this.basePath}/${resource._id}/menu`
        return resource
    }

    findMenu = (req,resp,next) => {
        Restaurant.findById(req.params.id,"+menu").then(rest =>{
            if(!rest){
                return next(new NotFoundError('Restaurant not Find'))
            }else{
                resp.json(rest.menu)
                return next()
            }
        })
    }

    replaceMenu = (req, resp, next) =>{
        Restaurant.findById(req.params.id).then(rest => {
            if(!rest){
                return next(new NotFoundError('Restaurant not Find'))
            }else{
                rest.menu = req.body
                return rest.save()
            }
        }).then(rest =>{
            resp.json(rest.menu)
            return next()
        }).catch(next)
    }

    applyRoutes(application: restify.Server){

        application.get(`${this.basePath}`, this.findAll)
        application.get(`${this.basePath}/:id`,[this.validateId, this.findById])
        application.post(`${this.basePath}`,this.save)
        application.put(`${this.basePath}/:id`,[this.validateId,this.replace])
        application.patch(`${this.basePath}/:id`,[this.validateId,this.update])
        application.del(`${this.basePath}/:id`,[this.validateId,this.delete])

        application.get('/restaurants/:id/menu', [this.validateId,this.findMenu])
        application.put('/restaurants/:id/menu', [this.validateId,this.replaceMenu])
    }
}

export const restaurantsRouter = new RestaurantsRouter()