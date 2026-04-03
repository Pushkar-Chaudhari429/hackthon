function FraudTable({ transactions }) {
  return (
    <table>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr
            key={transaction.id}
            className={
              transaction.status === "Blocked"
                ? "row-blocked"
                : transaction.status === "Suspicious"
                  ? "row-suspicious"
                  : "row-normal"
            }
          >
            <td>{transaction.userId}</td>
            <td>${transaction.amount}</td>
            <td>{transaction.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default FraudTable;
