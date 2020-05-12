import State from './State'
import Message from './Message'

type Reducer<S extends State, M extends Message = any> = (state: S, msg: M) => S

export default Reducer
