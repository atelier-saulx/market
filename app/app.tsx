import React, { useState } from 'react'
import { render } from 'react-dom'
import based from '@based/client'
import { Provider, useQuery, useClient, useAuthState } from '@based/react'

import basedConfig from '../based.json'
export const client = based(basedConfig)

const Item = ({ item }) => {
  return (
    <div
      style={{
        marginBottom: 16,
        padding: 32,
        border: '1px solid #eee',
      }}
    >
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            backgroundImage: `url(${item.picture?.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginRight: 32,
          }}
        />
        <div>
          <div>{item.name}</div>
          <div>{item.minPrice}</div>
        </div>
      </div>
      {item.bids.map((bid) => {
        return (
          <div key={bid.id}>
            {bid.price} {bid.user?.email} {bid.user?.name}
          </div>
        )
      })}
    </div>
  )
}

const Items = () => {
  const { data, loading } = useQuery('db', {
    totalItems: {
      $aggregate: {
        $function: 'count',
        $traverse: 'descendants',
        $filter: {
          $field: 'type',
          $operator: '=',
          $value: 'item',
        },
      },
    },
    items: {
      id: true,
      name: true,
      minPrice: true,
      picture: {
        src: true,
      },
      bids: {
        id: true,
        price: true,
        user: { email: true, id: true, name: true },
        $list: {
          $sort: {
            $order: 'desc',
            $field: 'price',
          },
          $limit: 5,
        },
      },
      $list: {
        $sort: {
          $order: 'desc',
          $field: 'createdAt',
        },
        $limit: 100,
        $find: {
          $traverse: 'descendants',
          $filter: {
            $field: 'type',
            $operator: '=',
            $value: 'item',
          },
        },
      },
    },
  })

  return (
    <div>
      <div>{data?.totalItems}</div>
      {loading
        ? 'loading...'
        : data?.items.map((item) => {
            return <Item key={item.id} item={item} />
          })}
    </div>
  )
}

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const client = useClient()

  return (
    <div>
      <input
        value={email}
        type="email"
        onChange={(e) => {
          setEmail(e.target.value)
        }}
      />
      <input
        value={password}
        type="password"
        onChange={(e) => {
          setPassword(e.target.value)
        }}
      />
      <button
        onClick={async () => {
          console.log(
            await client.call('login', {
              password,
              email,
            })
          )
        }}
      >
        Login
      </button>
    </div>
  )
}

const App = () => {
  const auth = useAuthState()
  const client = useClient()
  if (!auth.userId) {
    return <Login />
  }

  return (
    <div
      style={{
        padding: 32,
        fontFamily: 'arial',
      }}
    >
      <button
        onClick={() => {
          client.setAuthState({})
        }}
      >
        Logout
      </button>
      <Items />
    </div>
  )
}

render(
  <Provider client={client}>
    <App />
  </Provider>,
  document.body
)
