import State from './State'
import Message from './Message'

type Case<S extends State> = {
  type: string,
  reduce: (state: S, msg: Message) => Partial<S> | void
}

export default Case
