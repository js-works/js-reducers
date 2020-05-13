export default defineMessage

function defineMessage<A extends any[], P>(
  type: string
): {
  (...args: A): { type: string },
  type: string
}

function defineMessage<A extends any[], P>(
  type: string,
  getPayload: (...args: A) => P
): {
  (...args: A): { type: string, payload: P },
  type: string
}

function defineMessage<A extends any[]>(type: string, getPayload?: any): any {
  const ret = (...args: A) =>
    getPayload ? { type, payload: getPayload(...args) } : { type }

  ret.type = type

  return ret
}
