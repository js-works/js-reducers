import hasOwnProp from '../internal/hasOwnProp'
import State from '../internal/types/State'
import Message from '../internal/types/Message'
import Case from '../internal/types/Case'

export default function createReducer<S extends Readonly<State>>(initialState: S, cases: Case<S>[]) {
  const reducers: any = {}

  cases.forEach(({ type, reducer }) => {
    reducers[type] = reducer
  })

  return (state = initialState, msg: Message): S => {
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
