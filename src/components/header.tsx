import { Button, ButtonGroup, Card, Flex, FormLabel, Image } from "@chakra-ui/react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { env } from "~/env";
import { InitialFocus } from "./users/createUser";
import { set } from "react-hook-form";



export const HeaderPage: NextPage = ()=>{
 
  const [roleAdmin, setRoleAdmin] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter()

 
    //haciendo Logout en la session y limpiando el token
    const handleLogout =async()=>{
      try {
        await axios.delete(`${env.NEXT_PUBLIC_BACKEND_URL}/api/logout`);
        // Borra la cookie 'mitoken' del almacenamiento del navegador
        destroyCookie(null, 'jwt');
        // Redirige al usuario a la página de inicio u otra página deseada
        router.push('/')
      } catch (error) {
        console.error('Error al eliminar la cookie:', error);
      }
    }

    
    
   return ( 
    
    <Card boxShadow="1px 2px 1px 0px grey"  mt={4} ml={5} mr={5}>
    <Flex justifyContent="space-between" alignItems="center">
      <Image
      mb={2}
      ml={3}
        borderRadius='full'
        boxSize='50px'
        src="image/logo.jpg"
        alt='Dan Abramov'
        boxShadow="1px 2px 0px 1px gray"
        _hover={{bg:"red" , color:"red",  boxShadow:"1px 2px 0px 1px red"}}
        onClick={()=>router.push('/main')}
        cursor='pointer'
      />
      <FormLabel>usuario: {userName}</FormLabel>
      <ButtonGroup>
     {roleAdmin &&   <InitialFocus />}
    
     <Button colorScheme="red" h="3.5rem" onClick={()=>{handleLogout()}}>Logout</Button>
     </ButtonGroup>
     </Flex>
    </Card>

)}