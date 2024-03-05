import { Divider, Flex } from "@chakra-ui/react"
import RedirectIfNotAuthenticated from "middleware/authentication"
import {  useState } from "react"
import { ClientsList } from "~/components/clients/clientsList"
import {CreateClients} from "~/components/clients/createClient"
import { HeaderPage } from "~/components/header"

const Clients =()=>{
  const [updateClients , setUpdateClients] = useState<boolean | any>(false)
    return (<>
    <RedirectIfNotAuthenticated>
      <HeaderPage />
      <Flex mt="5vh" flexDirection="column" position="relative">  
      <CreateClients setUpdateClients={setUpdateClients} />
        <ClientsList updateClients={updateClients} />
      </Flex>
    </RedirectIfNotAuthenticated> 
      </>)
  }
export default Clients