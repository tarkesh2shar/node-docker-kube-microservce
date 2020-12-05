const OrderIndex = ({ orders }) => {
  console.log(orders);
  return (
    <ul>
      {orders.map((order) => {
        console.log(order);
        return (
          <li key={order.id}>
            {order.ticket} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};
OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};
export default OrderIndex;
