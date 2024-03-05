import { Button, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useDisclosure } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import RedirectIfNotAuthenticated from "middleware/authentication"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import {  z } from "zod"
import { env } from "~/env"

const ROLE_TYPE = ['admin', "seller"] as const
const userSchema = z.object({
  names: z.string().min(4, "Minimo de caracteres 4"),
  lastnames: z.string().min(4, "Minimo de caracteres 4"),
  email: z.string().email("campo tipo email"),
  login_code: z.string().min(6, "Minimo de caracteres 6").refine(value => /^[A-Z].*\d/.test(value), {
    message: "La contraseña debe comenzar con una letra mayúscula y contener al menos un número"
  }),
  roles: z.enum(ROLE_TYPE).refine((value) => ROLE_TYPE.includes(value), {
    message: "Debe seleccionar un rol"
  })
})

export type User = z.infer<typeof userSchema>

interface Props {
  userId?: string
}

export function InitialFocus({userId}:Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  useEffect(() => {
    // Verificar si userId existe para abrir el modal inicialmente
    if (userId) {
      onOpen();
    }
  },[userId]);


  const {register, handleSubmit, formState:{errors}, reset } = useForm<User>(
    {
      resolver: zodResolver(userSchema),
     defaultValues: async()=>{
        if(!userId) return {}

        try {
          onOpen()
          const {data} = await axios.get(`${env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`, {withCredentials:true})
          const roles = data.data.roles.admin?"admin":"seller"
          console.log(data.data)
          return {...data.data, roles:roles}
        } catch (error) {
           throw new Error
        }
       
      }
    }
  )
  //controlando el submit del modal dentro del form
  const onSubmit = async(data:User) =>{
    try {
      const PARAMS = !!userId?`/${userId}`: ""
      await axios(`${env.NEXT_PUBLIC_BACKEND_URL}/api/user${PARAMS}`,{
      method: userId?"PUT":"POST",
      data,
      withCredentials:true
    })
     reset()
     onClose()
     router.push('/main')
    
    } catch (error) {
      console.log(error)
    }
  }

const handleModalClose=()=>{
  router.back()
  onClose()
}

  return (
    <>

     { userId?"":<Button bg="black" color="white" h="3.5rem" onClick={onOpen}>Asignar Cuenta</Button>}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
       closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{userId?'Editando un Usuario':'Creando Usuario'}</ModalHeader>
          <ModalCloseButton color="red" onClick={handleModalClose}/>
         <form onSubmit={handleSubmit(onSubmit)}> 
          <ModalBody pb={6}>
            <FormControl isInvalid={!!errors.names}>
              <FormLabel>Nombres</FormLabel>
              <Input  placeholder='Nombres' {...register('names')} />
              <FormErrorMessage>{errors.names?.message}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={!!errors.lastnames}> 
              <FormLabel>Apellidos</FormLabel>
              <Input placeholder='Apellidos' {...register('lastnames')}/>
              <FormErrorMessage>{errors.lastnames?.message}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input placeholder='Email' {...register('email')}/>
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={!!errors.login_code}>
              <FormLabel>Contraseña</FormLabel>
              <Input placeholder='Password' {...register('login_code')} />
              <FormErrorMessage>{errors.login_code?.message}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={!!errors.roles}>
              <FormLabel>Role</FormLabel>
              <Select placeholder='Seleccione una opcion' {...register('roles')}>
                {ROLE_TYPE.map(roles => (
                  <option value={roles} key={roles}>{roles}</option>
                ))}
              </Select>
              <FormErrorMessage>{errors.roles?.message}</FormErrorMessage>
            </FormControl>

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='pink' type="submit" mr={3}>
              Save
            </Button>
            <Button onClick={handleModalClose} colorScheme='red'>Cancel</Button>
          </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )

}