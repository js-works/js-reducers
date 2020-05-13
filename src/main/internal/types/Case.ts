import State from './State'

type Case<T extends string, S extends State> = {
  type: T,
  reduce: (state: S, msg: { type: T } & Record<string, any>) => S
}

export default Case
