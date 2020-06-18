import Message from './Message'
import State from './State'

type Reducer<S extends State, M extends Message<any, any>> = (
  state: S | undefined,
  message: M
) => S

export default Reducer
