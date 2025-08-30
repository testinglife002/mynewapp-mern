import React from 'react'
import EditorContextProvider from './appcomponents/EditorContext'
import Notes from './appcomponents/Notes'

const NotesApp = ({user}) => {
  return (
    <>
        <EditorContextProvider>
            <Notes user={user} />
        </EditorContextProvider> 
    </>
  )
}

export default NotesApp