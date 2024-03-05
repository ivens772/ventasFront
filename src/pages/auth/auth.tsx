import { ViewOffIcon } from "@chakra-ui/icons";
import { Image, Box, Flex, Container } from "@chakra-ui/react";
import { NextPage } from "next";
import { LoginForm } from "~/components/loginForm";




export const Auth: NextPage = () => {


  return (
    
      <Container mt='5vh' mb="5vh">
        <Box>
          <Flex display="flex" mb={-4} flexDirection="column" alignItems="center">
            <Image
              borderRadius='full'
              boxSize='180px'
              src="image/logo.jpg"
              alt='Dan Abramov'
              boxShadow="1px 2px 0px 1px gray"
            />
          </Flex>
          <LoginForm />
        </Box>
      </Container>
    
  )
}
