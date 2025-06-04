import React from 'react'
import SearchBar from '@/components/dashboard/search-bar'
import ChatList from '@/components/chat/chat-list'

function Sidebar() {

  return (
    <>
        <SearchBar />
        <ChatList />
    </>
  )
}

export default Sidebar