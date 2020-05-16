import State from './State'

type Reducer<S extends State, M extends { type: string } = any> = (state: S | undefined, msg: M) => S

export default Reducer
