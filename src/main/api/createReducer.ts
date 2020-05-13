import hasOwnProp from '../internal/hasOwnProp'
import State from '../internal/types/State'
import Case from '../internal/types/Case'

export default function createReducer<S extends Readonly<State>>(initialState: S, cases: Case<any, S>[]) {
  const reducers: any = {}

  cases.forEach(({ type, reduce }) => {
    reducers[type] = reduce
  })

  return (state = initialState, msg: { type: string }): S => {
    let ret = state

    if (msg && hasOwnProp(msg, 'type') && hasOwnProp(reducers, msg.type)) {
      const result = reducers[msg.type](state, msg)
      
      if (result && result !== state) {
        ret = Object.assign({}, state, result)
      }
    }

    return ret
  }
}
