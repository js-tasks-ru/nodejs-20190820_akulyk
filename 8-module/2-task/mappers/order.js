module.exports = function mapOrder(order) {
  return {
    id: order.id,
    user: order.user,
    product: order.phone,
    phone: order.phone,
    address: order.address,
  };
};
