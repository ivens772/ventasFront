import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { CreateClients } from "~/components/clients/createClient"
import { HeaderPage } from "~/components/header"

const editClient = ()=>{
    const router = useRouter()
    const clientId = router.query.clientId
    const [closeModal, setCloseModal] = useState<boolean>(false)
    const { isOpen, onOpen, onClose } = useDisclosure()


    useEffect(()=>{
       
        if (clientId) {
            onOpen()
        }
        handleClose()
    },[])
    const handleClose=()=>{
        if(closeModal){
            router.back()
                    onClose();
          }
          console.log(closeModal)
    }

    const justClose=()=>{
        router.back()
                    onClose();
    }
  
  return (
    <>     
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent maxW="1000px"  boxShadow="lg" borderRadius={50}>
          <ModalBody pb={6} mt={2}>
            <CreateClients clientId={router.query.clientId as string} setUpdateClients={setCloseModal} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default editClient