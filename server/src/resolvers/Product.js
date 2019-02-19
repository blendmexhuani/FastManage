const Product = {
    
    creator: ({id}, args, context) => {
      return context.prisma.product({ id }).creator();
    },
  }
  
  module.exports = {
    Product,
  }