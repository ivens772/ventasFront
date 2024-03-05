import { Container, Heading } from "@chakra-ui/react"
import { InitialFocus } from "../../components/users/createUser"
import { useRouter } from "next/router"
import RedirectIfNotAuthenticated from "middleware/authentication"


const EditUser = ()=>{
    const router = useRouter()
    return (<>
    <RedirectIfNotAuthenticated>
       <Container>
        <InitialFocus userId={router.query.userId as string} />
       </Container>
    </RedirectIfNotAuthenticated>   
    </>)
}
export default EditUser