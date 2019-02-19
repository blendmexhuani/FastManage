const { Query } = require('./Query')
const { auth } = require('./Mutation/auth')
const { product } = require('./Mutation/product')
const { Product } = require('./Product')


module.exports = {
  Query, 
  Mutation: {
    ...auth,
    ...product,
    },
  Product
}
