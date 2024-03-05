import { Text, Card, Container, Heading, Spinner, Flex, Divider, Button} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NextPage } from "next";
import {User } from "./createUser";
import { env } from "~/env";
import {  RepeatClockIcon} from "@chakra-ui/icons";
import router from "next/router";
import { useEffect } from "react";

interface Usuario extends User {
    _id: string;
    isActive: boolean;
    // Agrega más propiedades según sea necesario
}

export const UserDownList: NextPage = () => {

    const { data: usuarios, isLoading, refetch } = useQuery({
        queryKey: ['users'], queryFn: async () => {
            const res = await axios.get(`${env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {withCredentials:true})
            
            return res.data.data
        }
    })

    useEffect(() => {
        if (usuarios) {
            const inactiveUsers = usuarios.filter((u: Usuario) => !u.isActive);
            if (inactiveUsers.length === 0) {
                router.push('/main');
            }
        }
    }, [usuarios, router]);

    if(!usuarios){
        return (<Spinner />)
    }
    return (
        <>
            <Container mt="5vh" maxW="1000px">
                <Card>
                    <Heading mt={2} mb={2} fontFamily="cursive" textAlign="center">Empleados dados de Baja</Heading>
                    <Button colorScheme="red" onClick={()=>router.back()}>Regresar</Button>
                    
                    <Flex gap={4} alignItems="center">
                            <Card
                                py={3}
                                px={3}
                                mt={2}
                                flex={16}
                                flexDirection="row"
                                justifyContent="space-between"
                                cursor="pointer"
                            >
                                <Text fontFamily="fantasy">Nombres</Text>
                                <Text fontFamily="fantasy">Apellidos</Text>
                                <Text fontFamily="fantasy">Email</Text>
                                <Text fontFamily="fantasy">Password</Text>
                            </Card>
                            <Card flex={1} justifyContent="center" alignItems="center" py={2} px={2}  mt={2} w={5} h={10}>
                            <Text fontFamily="fantasy">reintegro</Text>
                            </Card>
                    </Flex>

                      <Divider color="grey" mt={1} mb={3}/>  

                    {isLoading ? (<Spinner /> ) : usuarios.filter((u:Usuario)=>!u.isActive).length > 0 ? 
                        (usuarios.filter((u:Usuario)=> !u.isActive).map((u: Usuario) =>  (
                      
                        <Flex gap={4} alignItems="center">
                            <Card
                                key={u._id}
                                py={3}
                                px={3}
                                mt={2}
                                flex={16}
                                flexDirection="row"
                                justifyContent="space-between"
                                cursor="pointer"
                                _hover={{ bg: "gray.200", color: "#222" }}
                                onClick={() => router.push(`/main/${u._id}`)}
                            >
                                <Text>{u.names}</Text>
                                <Text>{u.lastnames}</Text>
                                <Text>{u.email}</Text>
                                <Text>{u.login_code}</Text>
                            </Card>
                            <Card flex={1} justifyContent="center" alignItems="center" bg="green" py={2} px={2}  mt={2} w={5} h={10}
                            _hover={{bg:"red.600" , color:"red"}}
                            onClick={async()=>{
                                try {
                                       await axios.put(`${env.NEXT_PUBLIC_BACKEND_URL}/api/userInteger/${u._id}`,
                                        {withCredentials:true})
                                       .then(() => refetch())
                                } catch (error) {
                                    console.log("error al dar de baja al usuario")
                                }
                            }}
                            >
                                <RepeatClockIcon color="white" />
                            </Card>
                        </Flex>
                    ))
                ):("")}
                </Card>
            </Container>
        </>
    ) 
}
