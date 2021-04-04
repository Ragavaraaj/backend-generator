Fastify comes with built-in support for fake http injection thanks to light-my-request.

.inject insures all registered plugins have booted up and our application is ready to test. Finally, we pass the request method we want to use and a route. Using await we can store the response without a callback.

    fastify.inject({
    method: String,
    url: String,
    query: Object,
    payload: Object,
    headers: Object,
    cookies: Object
    }, (error, response) => {
    // your tests
    })

.inject methods can also be chained by omitting the callback function:

    fastify
    .inject()
    .get('/')
    .headers({ foo: 'bar' })
    .query({ foo: 'bar' })
    .end((err, res) => { // the .end call will trigger the request
        console.log(res.payload)
    })
