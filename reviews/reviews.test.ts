import 'jest'
import * as request from 'supertest'

let address : string = (<any>global).address


test('get /reviews',() =>{
    return request(address)
    .get('/reviews')
    .then(response =>{
        expect(response.status).toBe(200)
        expect(response.body.items).toBeInstanceOf(Array)
    })
    .catch(fail)
})

test('post /review',() =>{
    return request(address)
    .post('/reviews')
    .send({
        date:'1550512525538',
        rating:5,
        comments:'Muito bom, uma pena eu ter que ir mais cedo por causa do meu filho',
        restaurant:'5c5c1e607c8d191e9a40143b',
        user:'5c584439b8968b7422b78660'
    })
    .then(response =>{
        expect(response.status).toBe(200)
        expect(response.body._id).toBeDefined()
        expect(response.body.rating).toBe(5)
    })
    .catch(fail)
})
