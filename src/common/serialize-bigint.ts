export function serializeBigInt(value: any): any {
  if (typeof value === 'bigint') return value.toString();
  if (Array.isArray(value)) return value.map(serializeBigInt);
  if (value && typeof value === 'object') {
    if (value instanceof Date) return value;
    if (Buffer.isBuffer(value)) return value;
    const output: Record<string, any> = {};
    for (const [key, child] of Object.entries(value)) {
      output[key] = serializeBigInt(child);
    }
    return output;
  }
  return value;
}

export function parseBigIntId(idRaw: string): bigint {
  if (!/^[0-9]+$/.test(idRaw)) {
    throw new Error('Invalid bigint id');
  }
  return BigInt(idRaw);
}
