export default function defineMessage<A extends any[]>(
  type: string,
  getPayload: (...args: A) => any = () => undefined
): {
  (...args: A): { type: string, payload: any },
  type: string
} {
  const ret = (...args: A) => ({
    type,
    payload: getPayload(...args)
  })

  ret.type = type

  return ret
}
