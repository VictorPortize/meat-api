import 'jest'
import * as request from 'supertest'


let address : string = (<any>global).address


test('get /users', () => {
    return request(address)
        .get('/users')
        .then( response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
})


test('post  /users', () =>{
    return request(address)
    .post('/users')
    .send({
        name: 'usuario1',
        email: 'usuiari@gmail.com',
        password:'123456',
        cpf: '12345678909'
    })
    .then( response => {
        expect(response.status).toBe(200)
        expect(response.body._id).toBeDefined()
        expect(response.body.name).toBe('usuario1')
        expect(response.body.email).toBe('usuiari@gmail.com')
        expect(response.body.cpf).toBe('12345678909')
        expect(response.body.password).toBeUndefined()
    }).catch(fail)
})


test('post /users - Error Validation',() =>{
    return request(address)
    .post('/users')
    .send({
        name: 'usuario2',
        email: 'usuiari2@gmail.com',
        password:'123456',
        cpf: '12345678998'
    })
    .then(response =>{
        expect(response.status).toBe(400)
    })
    .catch(console.error)
})


test('get /users/aaaa - not found',() => {
    return request(address)
    .get('/users/aaaaaaa')
    .then(response => {
        expect(response.status).toBe(404)
    }).catch(fail)
})


test('patch /users/:id', ()=>{
    return request(address)
    .post('/users')
    .send({
        name: 'usuario3',
        email: 'usuiari3@gmail.com',
        password:'123456',
    })
    .then( response => request(address)
        .patch(`/users/${response.body._id}`)
        .send({
            name: 'Usuário 3',
            email: "usuario3@gmail.com",
            password:'12341234'
        }))
    .then(response  =>{
        expect(response.status).toBe(200)
        expect(response.body._id).toBeDefined()
        expect(response.body.name).toBe('Usuário 3')
        expect(response.body.email).toBe('usuario3@gmail.com')
        expect(response.body.password).toBeUndefined()
    })
    .catch()
})


test('delete /users/asdasdas',() =>{
    return request(address)
    .delete(`/users/asdasdas`)
    .then(resposta => {
        expect(resposta.status).toBe(404)
    })
    .catch(fail)
})


test('delete /users/5c6ad1406f0c3e2fb527c2c2',() =>{
    return request(address)
    .delete(`/users/5c6ad1406f0c3e2fb527c2c2`)
    .then(resposta => {
        expect(resposta.status).toBe(404)
    })
    .catch(fail)
})