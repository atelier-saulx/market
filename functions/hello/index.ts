import { BasedFunction } from '@based/functions'

// Based functions of type 'function' are
// intended to be use with the .call()
// method on the client. They return the data
// and are terminated until called again.
const hello: BasedFunction = async (_based, payload, _ctx) => {
  return `Hello, ${payload}`
}
export default hello
