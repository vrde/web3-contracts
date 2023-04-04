import { useContractsContext } from "@contexts/ContractsContext";

export default () => {
  const { storage } = useContractsContext();

  return (
    <>
      <p>{storage?.address}</p>
    </>
  );
};
