import { Card, Container, Flex, Heading, Image } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";


 
export const ContentPage: NextPage = ()=>{
  const router = useRouter()
  const {jwt} = parseCookies()
    return(
   
     <Flex  flexWrap="wrap" justifyContent="center" gap={4} mt="10vh">
     <Card w="300px" cursor="pointer"  _hover={{bg:"gray.200", color:"#222"}} >
       <Flex alignItems="center"> 
        <Image 
        m={4}
        borderRadius='full'
        boxSize='50px'
        src="image/logoVenta.png"
        alt='Dan Abramov'
        boxShadow="1px 2px 0px 1px gray"
        />
        <Heading>Venta</Heading>
       </Flex> 
     </Card>

     <Card w="300px" cursor="pointer"  _hover={{bg:"gray.200", color:"#222"}} onClick={()=>router.push('/clients')} >
       <Flex alignItems="center"> 
        <Image 
        m={4}
        borderRadius='full'
        boxSize='50px'
        src="image/logoUser.png"
        alt='Dan Abramov'
        boxShadow="1px 2px 0px 1px gray"
        />
        <Heading>Clientes</Heading>
       </Flex> 
     </Card>     
    </Flex>
   

)}