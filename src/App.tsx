import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'

const OPEN_AI_API_KEY = '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'

function App() {
  
  //managing messages
  const [messages, setMessages] = useState([
    {
      message : 'Hi, I am ChatGPT!',
      sender : 'ChatGPT',
    }
  ])

  //managing typing indicator
  const [typing, setTyping] = useState(false)

  //handling send event
  const handleSend = async (message : any) => {
    const newMessage = {
      message : message,
      sender : 'user',
      direction : 'outgoing'
    }
    //add new message to existing list of messages
    const messagesList = [...messages, newMessage]
    //update messages state
    setMessages(messagesList)
    //enable typing indicator
    setTyping(true)
    //call OpenAI API
    await processMessages(messagesList)
  }

  //process messages
  async function processMessages(chatMessagesList : any){
    //map messages as per request body required by API
    let apiMessageList = chatMessagesList.map(((message:any)=>{
      let role=""
      if(message.sender==="ChatGPT"){
        role="assistant"
      }else{
        role="user"
      }
      return { role : role, content : message.message}
    }))

    //request body for API call
  const reqBody={
    "model":'gpt-3.5-turbo',
    "messages" : [...apiMessageList]
  }

  //making API call
  await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers : {
      "Authorization" : "Bearer " + OPEN_AI_API_KEY,
      "Content-Type" : "application/json"
    },
    body : JSON.stringify(reqBody)
  }).then((data) => {
    return data.json()
  }).then((data)=> {
    setMessages([
      ...chatMessagesList, {
        message : data.choices[0].message.content,
        sender : 'ChatGPT'
      }
    ])
    setTyping(false)
  })
  }

  

  return (
    <>
    <h3 style={{color:"black"}}>ChatGPT Clone with React + Open AI</h3>
      <div style={{position:"relative", height:"700px", width:"600px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList scrollBehavior="smooth" typingIndicator={ typing ? <TypingIndicator content="ChatGPT is typing"/> : null }>
            {
              messages.map(((message : any,index:number)=>{
                return <Message key={index} model={message}/>
              }))
            }
            </MessageList>
            <MessageInput placeholder='Type here' onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  )
}

export default App
