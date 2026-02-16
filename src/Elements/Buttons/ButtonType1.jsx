import React from 'react'

const ButtonType1 = ({button_text, event_handler, too_tip}) => {
  return (
    <button className='button_type_1 p-1 px-2 text-sm text-white cursor-pointer hover:bg-gray-600 hover:underline trainsition-all duration-400 hover:duration-400 rounded-sm ' onClick={event_handler}>
      {button_text}
    </button>
  )
}

export default ButtonType1
