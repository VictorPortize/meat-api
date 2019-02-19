import {Server} from './server/server'
import {usersRouter} from './users/users.router'
import {restaurantsRouter} from './restaurants/restaurant.router'
import { reviewRouter } from './reviews/reviews.router'
import { initRouter } from './common/initRouter'

const server = new Server()
server.bootstrap([
    usersRouter,
    restaurantsRouter,
    reviewRouter,
    initRouter]).then( server => {
    console.log('Server is listening on:', server.application.address().port)
}).catch(error => {
    console.log('Server failed to start')
    console.error(error)
    process.exit(1)
})