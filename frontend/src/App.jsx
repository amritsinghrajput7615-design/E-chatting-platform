

import  {UserProvider}  from './context/User.context.jsx'
import AppRouter from './router/AppRouter'

function App(){
  return (
    <UserProvider>
      
      <AppRouter />
      
    </UserProvider>
   
  )
}

export default App
