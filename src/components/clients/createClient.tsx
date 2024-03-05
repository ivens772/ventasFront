import { Button, Card, Container, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { fetchGetCountries, fetchGetState } from "apis/fetchCountries";
import {  z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { env } from "~/env";
import axios from "axios";
import Swal from 'sweetalert2';
import { useRouter } from "next/router";


//validando datos con zod
const clientSchema = z.object({
    names: z.string().min(4, "numero de caracters minimos 4").nonempty("campo obligatorio"),
    lastnames: z.string().min(4, "numero de caracters minimos 4").nonempty("campo obligatorio"),
    phone_number: z.string().min(8).max(8),
    departament: z.string(),
    city: z.string().optional(),
    street: z.string().nonempty("campo obligatorio"),

})

export type Client = z.infer<typeof clientSchema>

//tipando el dato que viene como props
interface Prop { 
    clientId?: string,
    setUpdateClients?: boolean | any,
}

export const CreateClients = ({clientId, setUpdateClients}:Prop) => {
    const router = useRouter()
    const [allState, setState] = useState<any>()//estado para los departamentos
    const [allCity, setCity] = useState<any>()//estado para los municipios
    const [createClient, setCreateClient] = useState<any>(false)//escondemos el fromulario si no se ocupa


 //react-hook-form
    const { register, getValues, setValue, handleSubmit, formState:{errors}, reset } = useForm<Client>({
        resolver:zodResolver(clientSchema),
        defaultValues: async()=>{
            if (!clientId) return {}            
            const {data} = await axios.get(`${env.NEXT_PUBLIC_BACKEND_URL}/api/client/${clientId}`)
            setCreateClient(true)
            return data.data
        }
        
    })


    useEffect(() => {
        gettingCountries()
    }, [])
     //importando la funcion fetchGetCoutries de la api
    const gettingCountries = async () => {
        console.log(allState)
        fetchGetCountries()
            .then(states => setState(states))
            .catch(err => console.log("erro al cargar los departamentos: " + err))
    }
 
    //tomando el valor seleccionado en el select
    const handleCountryChange = (e: string) => {
        setValue('departament', e); //establecer el valor seleccionado en el form
        let departamento = getValues('departament')
        console.log({ departamento })
        if (allState) {
            fetchGetState(departamento)
                .then(cities => setCity(cities))
                .catch(err => console.log("Error al cargar los municipios: " + err));
        } else {
            setCity(null); // Reiniciar los estados si no se ha seleccionado ningún país
        }
    }
 //un segundo efecto en el dom para ver si hemos seleccionado algo y asignar el departamento y asi desplegar los municipios
    useEffect(() => {
        if (!allState) return;

        const selectedCountry = getValues('departament');
        if (!selectedCountry) return;

        fetchGetState(selectedCountry)
            .then(states => setCity(states))
            .catch(err => console.log("Error al cargar los estados: " + err));

    }, [allState]); // Ejecutar cada vez que allCountry cambie

    const handleNewClient = () => {
        setCreateClient(true)
    }
    //si no existe un id  el createClient es true me muestar el boton
        if (!createClient && !clientId) {
            return <Container maxW="1000px"><Button colorScheme="red" w="100%" onClick={handleNewClient}>Agregar Nuevo CLiente</Button></Container>
        }

        //si no ha cargado los departamentos creamo un spinner
        if (!allState ) {
            return (!clientId?(<Container maxW="1000px" display="flex" justifyContent="center" alignItems="center" h="30vh">
                       <Spinner color="red" />
                  </Container>):<Container maxW="1000px" display="flex" justifyContent="center" alignItems="center" h="60vh">
                       <Spinner color="black" />
                  </Container>)
        } 

    //onsubmit from form
    const onSubmit = async(data:Client)=>{
        try {
            console.log({data})
            const PARAMS = !!clientId?`/${clientId}`:""
            await axios(`${env.NEXT_PUBLIC_BACKEND_URL}/api/client${PARAMS}`,{
                method: !!clientId?'PUT':'POST',
                data,
                withCredentials: true,
            }).then(response => {
                const success = response.status
                if (success === 200) {
                    Swal.fire({
                        icon: 'success',
                        text: clientId?'cliente editado':'Creado con exito'
                    })
                    reset()
                    setCreateClient(false)
                    setUpdateClients((prevState:any) => !prevState)
                    router.push('/clients')
                }
            }).catch((error) => {
                const errors = error.response.status
               console.log({errors})
               if (errors === 401) {
                 console.log("ya existe el numero con este usuario")
                 Swal.fire({
                    icon: 'error',
                    text: 'Numero de telefono ya registrado'
                 })
               }else if(errors === 500){
                Swal.fire({
                    icon: 'warning',
                    text: 'Error del servidor'
                 })
               }
            })
        } catch (error) {
            console.log(error)
        }
    }    

    //retornamos el form de create si el createCliente es False
        return (
            <>
                <Container maxW="1000px"  mt="5vh"   >
                    <Card p={5}>
                        <Flex >
                            <Heading flex={12} color='gray.600'>{clientId?"Editando cliente":"Creando Cliente"}</Heading>
                            <Button colorScheme="red" onClick={() => {
                                if(clientId){router.push('/clients')}
                                setCreateClient(false)
                                }} mt={2}>cancelar</Button>
                        </Flex>

                        <Divider m={5} />
                      <form onSubmit={handleSubmit(onSubmit)}>  
                        <Flex gap={4} m={2} flexWrap={{ base: "wrap", md: "nowrap" }}>
                            <FormControl flex={4} isInvalid={!!errors.names}>
                                <FormLabel color="gray.500">Nombres</FormLabel>
                                <Input {...register('names')} />
                                <FormErrorMessage>{errors.names?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl flex={4} isInvalid={!!errors.lastnames} >
                                <FormLabel color="gray.500">Apellidos</FormLabel>
                                <Input {...register('lastnames')} />
                                <FormErrorMessage>{errors.lastnames?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl flex={2} isInvalid={!!errors.phone_number}>
                                <FormLabel color="gray.500">No telefono</FormLabel>
                                <Input type="text" {...register('phone_number')} isDisabled={!!clientId?true:false}/>
                                <FormErrorMessage>{errors.phone_number?.message}</FormErrorMessage>
                            </FormControl>
                        </Flex>

                        <Flex gap={2} flexWrap={{ base: "wrap", md: "nowrap" }}>
                            <FormControl flex={2} isInvalid={!!errors.departament}>
                                <FormLabel color="gray.500">Departamento</FormLabel>
                                <Select {...register('departament')} onChange={(e) => handleCountryChange(e.target.value)}>
                                    {allState.map((c: any) => (
                                        <option key={c.id} value={c.state_name}>{c.state_name}</option>
                                    ))}
                                </Select>
                                <FormErrorMessage>{errors.departament?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl flex={2} isInvalid={!!errors.city}>
                                <FormLabel color="gray.500">Municipio</FormLabel>
                                {allCity && (
                                    <Select {...register('city')} placeholder="Seleccione un estado"  {...register('city')}>
                                        {allCity.map((s: any) => (
                                            <option key={s.id} value={s.city_name}>{s.city_name}</option>
                                        ))}
                                    </Select>
                                )}
                                <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl flex={5} isInvalid={!!errors.street}>
                                <FormLabel color="gray.500">Colonia</FormLabel>
                                <Input {...register('street')} />
                                <FormErrorMessage>{errors.street?.message}</FormErrorMessage>
                            </FormControl>

                        </Flex>
                        <FormControl mt={2}>
                                <Button type="submit" colorScheme="red">{clientId?"Actualizar":"Guardar"}</Button>
                            </FormControl>
                     </form>



                    </Card>
                </Container>
            </>
        );
    }



