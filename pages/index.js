import Head from 'next/head'
import Sidebar from '../components/sidebar'
import app from '../utils/firebase'
import {getAuth} from 'firebase/auth'
import {useAuthState} from 'react-firebase-hooks/auth'
import Loading from '../components/Loading'
import Login from '../components/Login'
import MessegeBar from '../components/MessegeBar'
import styled from 'styled-components'
import { useEffect } from 'react'
import { doc, getFirestore, setDoc, serverTimestamp, getDocs, collection, getDoc } from 'firebase/firestore'
import NoMesseges from '../components/NoMesseges'

export async function getServerSideProps(context){
 
  const db = getFirestore(app);

  let chats = [];

  var querySnapshot = await getDocs(collection(db, "Chats"))
    
  querySnapshot.forEach((doc)=>{
    chats = chats.concat({id: doc.id, ...doc.data()});

  })
  return {
    props: {
      chats: chats
    }
  }
}

export default function Home({chats}) {
  
  const [user, loading] = useAuthState(getAuth(app))

  const db = getFirestore(app)



  useEffect(
    function(){
      if(user){
        setDoc(doc(db, "Users", user?.uid), {
          
          uid: user?.uid,
          email: user?.email,
          photoUrl: user?.photoURL,
          lastSeen: serverTimestamp(),
        })
      }

  },[user])


  if(!user){
    return <Login/>
  }

  if(loading){
    return <Loading/>
  }

  return (
    <div>
      <Head>
        <title>WhatsApp Clone</title>
        <meta name="description" content="Generated by Me" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <Sidebar chats={chats}/>
        <NoMesseges/>
      </Main>


        
    </div>
  )
}

const Main = styled.main`
  display: flex;
  width: 100vw;
  height: 100vh;
`;