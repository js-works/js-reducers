import { produce } from 'immer'

import hasOwnProp from '../internal/hasOwnProp'
import State from '../internal/types/State'
import Message from '../internal/types/Message'
import Case from '../internal/types/Case'

export default function createImmerReducer<S extends State>(initialState: S, cases: Case<S>[]) {
  const reducers: any = {}

  cases.forEach(({ type, reducer }) => {
    reducers[type] = reducer
  })

  return (state = initialState, msg: Message): S => {
    let ret = state

    if (msg && hasOwnProp(msg, 'type') && hasOwnProp(reducers, msg.type)) {
      ret = produce(state, state => reducers[msg.type](state, msg))
    }

    return ret
  }
}
