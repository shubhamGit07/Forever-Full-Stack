import React from 'react'

const Title = ({ text1, text2 }) => {
  return (

    <div className='inline-flex items-center gap-3 mb-3'>

      {/* TEXT */}

      <p className='text-gray-500 text-2xl'>

        {text1}{' '}

        <span className='text-gray-700 font-medium'>
          {text2}
        </span>

      </p>

      {/* DASH AFTER TITLE → KEEP BLACK */}

      <p className='w- sm:w-14 h-[2px] bg-gray-700'></p>

    </div>

  )
}

export default Title