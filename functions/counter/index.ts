import { BasedQueryFunction } from '@based/functions'

// Query function should be used when data
// is subscribed to by the client.
const counter: BasedQueryFunction = async (_based, _payload, update) => {
  let count: number = 0
  const interval = setInterval(() => {
    // Update function updates the
    // client state.
    update(count++)
  }, 1000)

  // Query functions should return
  // a cleanup function. It's run when
  // closing the connection
  return () => {
    clearTimeout(interval)
  }
}
export default counter
