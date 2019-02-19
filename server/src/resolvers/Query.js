
const Query = {
  product(parent, args, context) {
    return context.prisma.product(args);
  },
  products(parent, args, context) {
    return context.prisma.products({});
  },
  users(parent, args, context) {
    return context.prisma.users({});
  },
  user(parent, args, context) {
    return context.prisma.user(args);
  },
}

module.exports = { Query }
