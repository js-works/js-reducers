export default defineMessage

function defineMessage<T extends string, A extends any[], P>(
  type: T
): {
  (...args: A): { type: T },
  type: T
}

function defineMessage<T extends string, A extends any[], P>(
  type: T,
  getPayload: (...args: A) => P
): {
  (...args: A): { type: T, payload: P },
  type: T
}

function defineMessage<T extends string, A extends any[]>(
  type: T,
  getPayload?: any
): any {
  const ret = (...args: A) =>
    getPayload ? { type, payload: getPayload(...args) } : { type }

  ret.type = type

  return ret
}
