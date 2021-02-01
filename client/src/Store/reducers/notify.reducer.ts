import { SET_NOTIFY, CLOSE_NOTIFY } from "Store/constants";

interface NotifyProps {
  messages: Array<string>;
}

const initialState: NotifyProps = {
  messages: []
};

export default function notifyReducer(state = initialState, action: any): any {
  switch (action.type) {
    case SET_NOTIFY:
      return {
        ...state,
        messages: [...state.messages, action.message]
      };

    case CLOSE_NOTIFY:
      const messages = [...state.messages];
      messages.splice(action.index, 1);

      return {
        ...state,
        messages
      };
    default:
      return state;
  }
};
