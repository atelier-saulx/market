export default {
  languages: ['en'],
  types: {
    file: {
      prefix: 'fi',
    },
    user: {
      prefix: 'us',
      fields: {
        bids: {
          type: 'references',
          bidirectional: {
            fromField: 'user',
          },
        },
      },
    },
    bid: {
      prefix: 'bi',
      fields: {
        price: { type: 'number' },
        user: {
          type: 'reference',
          bidirectional: {
            fromField: 'bids',
          },
        },
        item: {
          type: 'reference',
          bidirectional: {
            fromField: 'bids',
          },
        },
      },
    },
    item: {
      prefix: 'it',
      fields: {
        bids: {
          type: 'references',
          bidirectional: {
            fromField: 'item',
          },
        },
        name: { type: 'string' },
        minPrice: { type: 'number' },
        picture: {
          type: 'reference',
          meta: { format: 'file' },
        },
      },
    },
  },
}
