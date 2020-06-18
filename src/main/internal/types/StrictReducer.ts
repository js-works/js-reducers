import Message from './Message'
import State from './State'

type StrictReducer<S extends State, M extends Message<any, any>> = (
  state: S,
  message: M
) => S

export default StrictReducer
