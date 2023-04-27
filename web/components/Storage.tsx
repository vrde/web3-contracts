import { useContractsContext } from "@/contexts/ContractsContext";
import { BigNumber } from "ethers";

import { useEffect, useState } from "react";

export default function Storage() {
  const contracts = useContractsContext();
  const [value, setValue] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<string | null>(null);

  useEffect(() => {
    contracts?.storage.retrieve().then((n) => {
      setValue(n.toString());
    });
  }, [contracts]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await contracts?.storage.store(BigNumber.from(newValue));
  }

  return (
    <>
      <h2>Storage contract</h2>

      <p>Address: {contracts?.storage.address}</p>
      <p>Current value: {value}</p>

      <form onSubmit={handleSubmit}>
        <input onChange={(e) => setNewValue(e.target.value)} type="number" name="value" />
        <button type="submit">Store</button>
      </form>
    </>
  );
}
