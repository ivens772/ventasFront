import { Box, Text, Card, Container, Flex, Spinner } from "@chakra-ui/react"
import { Client } from "./createClient"
import { useQuery } from "@tanstack/react-query"
import { env } from "~/env"
import axios from "axios"
import { useEffect } from "react"
import { useRouter } from "next/router"

interface Prop extends Client {
    _id: string,
}

interface Props {
    updateClients: boolean | any,
}


export const ClientsList = ({ updateClients }: Props) => {
    const router = useRouter()

    const { isLoading, data: clients, refetch } = useQuery({
        queryKey: ['Client'], queryFn: async () => {
            const res = await axios.get(`${env.NEXT_PUBLIC_BACKEND_URL}/api/clients`, { withCredentials: true })
            return res.data.data
        }
    })

    useEffect(() => {
        refetch()
    }, [updateClients])
    
    return <>
        <Container maxW="1000px" mt={5}>
            <Box maxH="400px" overflowY="auto" boxShadow="lg" borderRadius={50}>
                {!!isLoading ? <Spinner colorScheme="red" /> : clients.map((c: Prop, index:number) => (
                    <Flex flexDirection="column" flexWrap="wrap" key={c._id}>
                        {index === 0 && (
                            <Card flexDirection="row" fontWeight="bold" textAlign="center"  display="flex" alignItems="center">
                                <Text flex={4}>Nombre</Text>
                                <Text flex={5}>Direccion</Text>
                                <Text flex={2}>Telefono</Text>
                            </Card>
                        )}
                        <Card  onClick={() => { router.push(`/clients/${c._id}`) }} m={2} 
                        display="flex" flexDirection="row" alignItems="center" textAlign="center" 
                        cursor='pointer'  _hover={{bg:"red.100", color:"black"}}>
                            <Text flex={4}>{c.names} {c.lastnames}</Text>
                            <Text flex={5}>{c.street}, {c.city}</Text>
                            <Text flex={2}>{c.phone_number}</Text>
                        </Card>
                    </Flex>
                ))}
            </Box>
        </Container>
    </>
}