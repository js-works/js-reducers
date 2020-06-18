import Message from './Message'
import State from './State'
import StrictReducer from './StrictReducer'

type Case<T extends string, S extends State> = {
  type: T
  reduce: StrictReducer<S, Message<T, any>>
}

export default Case
