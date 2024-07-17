"use client"
import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import dayjs from 'dayjs';

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { Message } from '@/model/User'
import { useToast } from './ui/use-toast'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void,
}


function MessageCard({message, onMessageDelete}: MessageCardProps) {

  const {toast} = useToast()


    const handleMessageDelete = async () =>{

        try {
            const result = await axios.delete<ApiResponse>(`/api/deleteMessage/${message._id}`)
        
            
            toast({
                title: "Success",
                description: "Message Deleted😃",
              });
    
              onMessageDelete(message._id as string)
        } catch (error) {
            toast({
                title: "Failed",
                description: "Failed to delete Message",
                variant: "destructive",
              });
        }
    }




  return (
    <div className='m-2'>

    <Card className='w-full box-stroke-3'>
  <CardHeader>
    <CardTitle>{dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p>{message.content}</p>
  </CardContent>

<div className='w-full pb-4'>
  <AlertDialog>
  <AlertDialogTrigger>
    <Button className='ml-6 pl-8 pr-8' variant='destructive'>Delete</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className='bg-red-500' onClick={ handleMessageDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

</div>
    

</Card>
</div>
  )
}

export default MessageCard