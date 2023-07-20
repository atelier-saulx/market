import { BasedFunction } from '@based/functions'

// Based functions of type 'function' are
// intended to be use with the .call()
// method on the client. They return the data
// and are terminated until called again.
const login: BasedFunction<{ email: string; password: string }> = async (
  based,
  payload,
  ctx
) => {
  const { user } = await based
    .query('db', {
      $id: 'root',
      user: {
        password: true,
        id: true,
        $find: {
          $traverse: 'children',
          $filter: [
            {
              $field: 'type',
              $operator: '=',
              $value: 'user',
            },
            {
              $field: 'email',
              $operator: '=',
              $value: payload.email,
            },
          ],
        },
      },
    })
    .get()

  if ((await based.call('db:digest', payload.password)) === user.password) {
    return based.renewAuthState(ctx, {
      token: 'token!',
      userId: user.id,
      persistent: true,
    })
  }

  throw new Error('Wrong!!!')
}
export default login
