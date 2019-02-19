import * as restify from 'restify'
import {EventEmitter} from 'events'
import {NotFoundError} from 'restify-errors'

export abstract class Router extends EventEmitter {
    abstract applyRoutes(application: restify.Server)

    envelope(document: any): any{

        return document
    }

    envelopeAll(document: any[], options: any): any{
        return document
    }

    render( response : restify.Response, next: restify.Next){
        return (document) => {
            if(document){
                this.emit('beforeRender',document)
                response.json(this.envelope(document))
            }else{
                throw new NotFoundError('Documento não encontrado')
            }
            return next(false)
        }
    }

    renderAll(response : restify.Response, next: restify.Next, options: any = {}){
        return (documents : any[]) => {
            if(documents){
                documents.forEach((document,index,array) => {
                    this.emit('beforeRender',document)
                    array[index] = this.envelope(document)
                })
                response.json(this.envelopeAll(documents, options))
            }else{
                response.json(this.envelopeAll( [], options))
            }
            return next()
        }
    }
}