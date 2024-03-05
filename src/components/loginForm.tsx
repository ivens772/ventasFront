import { ViewOffIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Card, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { env } from "~/env";

//validando con zod e infiriendo el tipo de datos para el form 

const schema = z.object({
    email: z.string().email("solo se permite campos tipo email"),
    password: z.string().min(5, "minimo de caracteres 5"),
})

type Fieldvalues = z.infer< typeof schema>


export const LoginForm:NextPage = ()=>{
//funciones fetching para el ingreso al panel
const router = useRouter()

const [errorMessagePost, setErrorMessage] = useState<string | null>(null)

const {handleSubmit, register, getValues, formState:{errors}} = useForm<Fieldvalues>(
   {
    resolver: zodResolver(schema),
    defaultValues: {
      email: "ivens@gmail.com",
      password: "calderon03",
    }
   }
)

const onSubmit =async()=>{
    const {email, password} = getValues()
   try {
     await axios.post(`${env.NEXT_PUBLIC_BACKEND_URL}/one/auth/${email}`, { password }, {withCredentials:true})
     .then(()=>{
       setErrorMessage(null)
       router.push('/main')
     })
     .catch(({response})=>{
      if (response.status === 401) {
       setErrorMessage("Email or Password incorrect, please try again")
      }
     })
    
   } catch (error) {
     console.log("peticion incorrecta")
   }
}

 return ( 
    <Card p={3} boxShadow="1px 2px 1px 2px black" >
    <form onSubmit={handleSubmit(onSubmit)}>
        <Heading mt={4} mb={4}  textAlign="center" fontFamily="Helvetica" >Login</Heading>
        {errorMessagePost ? <Text color="red" textAlign="center">Correo o Contraseña Invalidos, intente nuevamente</Text> : ""}
      <FormControl isInvalid={!!errors.email}> 
        <FormLabel>Usuario</FormLabel>
        <Input type="text" placeholder="Escriba Su Usurio" {...register('email')} />
        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}> 
        <FormLabel>Contraseña</FormLabel>
        <Flex gap={2}>
        <Input type= "text" placeholder="Escriba Su Contraseña" flex={8} {...register('password')}/>
        <ViewOffIcon flex={1} mt={3} />
        </Flex>
        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <ButtonGroup mt={4}>

            <Button colorScheme="blue" type="submit">Iniciar Sesion</Button>

        </ButtonGroup>
    </form>
  </Card>

)}
