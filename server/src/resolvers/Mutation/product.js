
const product = {
  async createProduct(parent, args, context, info) {
    const product=await context.prisma.createProduct(
     args.data
    );
    return product;
  },
  async updateProduct(parent, args, context) {
    return context.prisma.updateProduct({data: args.data, where: args.where})
  }
}

module.exports = { product }
