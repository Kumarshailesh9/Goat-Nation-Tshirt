import React from 'react'

function Button({btn}:{btn:string}) {
  return (
    <div>
        <button className='border-2 bg-black text-white p-3 w-100 rounded-2xl font-bold '>{btn}</button>
    </div>
  )
}

export default Button