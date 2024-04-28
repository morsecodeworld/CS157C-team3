import React from 'react'

const DashboardGrid = () => {
  return (
    <div className="bg-white px-10 pt-7 pb-10 rounded-sm border border-gray-200 flex-2">
        <strong className="text-3xl font-bold text-gray-800 mb-4">Inventory Status</strong>
        <div className='mt-7'>
            <div className="flex gap-4 w-full">
        
        <BoxWrapper>
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
              
            </div>
            <div className="pl-4">
                <span className="text-sm text-gray-500 font-semibold"> Total product:</span>
                <div className="flex items-center">
                   <strong className="text-xl txt-gray-800 font-bold">2</strong> 
                </div>
            </div>
        </BoxWrapper>

        <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-amber-500">
              
              </div>
              <div className="pl-4">
                  <span className="text-sm text-gray-500 font-semibold"> Out of Stock:</span>
                  <div className="flex items-center">
                     <strong className="text-xl txt-gray-800 font-bold">2</strong> 
                  </div>
              </div>
        </BoxWrapper>

        <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-lime-500">
              
              </div>
              <div className="pl-4">
                  <span className="text-sm text-gray-500 font-semibold"> All Categories:</span>
                  <div className="flex items-center">
                     <strong className="text-xl txt-gray-800 font-bold">2</strong> 
                  </div>
              </div>
        </BoxWrapper>

        <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-indigo-500">
              
              </div>
              <div className="pl-4">
                  <span className="text-sm text-gray-500 font-semibold"> Total amount (USD)</span>
                  <div className="flex items-center">
                     <strong className="text-xl txt-gray-800 font-bold">2</strong> 
                  </div>
              </div></BoxWrapper>    
       
        </div>
        </div>
    </div>
  )
}

export default DashboardGrid

function BoxWrapper({children}) {
    return <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">{children}</div>
}
