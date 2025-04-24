export const serializeBigInt = (obj: Record<string, unknown>) =>
  JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
