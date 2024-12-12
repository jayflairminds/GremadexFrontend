import React from 'react'
import { ViewDocumentComponent } from '../viewDocumentComponent/ViewDocumentComponent'

export const DocumentViewer = ({isSummaryModal,setIsSummaryModal}) => {
  return (
    <div>
        <ViewDocumentComponent isSummaryModal={isSummaryModal} setIsSummaryModal={setIsSummaryModal}/>
    </div>
  )
}
