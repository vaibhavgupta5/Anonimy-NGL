"use client"
import MessageCard from "@/components/MessageCard";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message, User } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function Dashboard() {

  const [messages, setMessages] = useState<Message[]>([])

  const [isLoading, setisLoading] = useState(false)

  const [isChecked, setisChecked] = useState(true)

  const [isSwitchLoading, setisSwitchLoading] = useState(false)

  const {toast} = useToast();

  const handleDeleteMessages = (messageId: string) =>{
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const {data:session} = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })

  const {register, watch , setValue} = form

  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessage = useCallback(async () => {
    setisSwitchLoading(true)

    try {
     const result = await axios.get("/api/acceptmessage")


     console.log(result.data)
      setisChecked(result.data.isAcceptingMessage)
      setValue("acceptMessages", result.data.isAcceptingMessage)

      console.log(isChecked)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast({
        title: "Failed to Update",
        description: "Please try again",
        variant: "destructive",
      });
    
    }finally{
      setisSwitchLoading(false)
    }

  }, [setValue])


  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setisLoading(true)
    setisSwitchLoading(false)

    try {
        const result = await axios.get("/api/get-messages")
        
        setMessages(result.data?.messages || []) 

        if(refresh){
            
      toast({
        title: "Showing Latest Messages",
        description: "Refreshing messages",
      });
        }

    
      } catch (error) {  
        toast({
          title: "Failed to Update",
          description: "Please try again",
          variant: "destructive",
        });
      
      }finally{
        setisSwitchLoading(false)
        setisLoading(false)
      }
  }, [setisLoading, setMessages])


  useEffect(() =>{

    if(!session || !session.user){
      return
    }

    fetchMessages();
    fetchAcceptMessage();

  }, [session, setValue, fetchAcceptMessage, fetchMessages])


  const handleSwitchChange = async () =>{
    try {
      const result = await axios.post<ApiResponse>("/api/acceptmessage", {acceptMessages: !acceptMessages})

      setisChecked(!isChecked)
      console.log(result)

      setValue("acceptMessages", !acceptMessages)

      toast({
        title: result.data.message,
      });

    } catch (error) {
      toast({
        title: "Failed to Update",
        description: "Please try again",
        variant: "destructive",
      });
    
    }finally{
      setisSwitchLoading(false)
    }
  }


  let username;

  if (session && session.user) {
    username = session.user.username;
  }
  const baseUrl = `${window.location.protocol}//${window.location.host}`

  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () =>{
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Copied",
      description: "Profile URL has been copied to clipboard",
    });
  }

  if(!session || !session.user){
    return <div>Please Login</div>
  }

  return (
    <div className="flex items-center  h-[100vh]  bg-[#0D1117] w-full">
      <Sidebar/>
      <div className="p-8 flex flex-col justify-start items-start h-full w-full md:flex-row">
        <div className="w-[100%] flex flex-col justify-start items-start md:w-[75%]">
          <h1 className="text-[10vw] text-white font-extrabold opacity-[1] z-[1] lg:text-[10vw] text-stroke-3 w-[100%] leading-[12rem] mb-8 text-start">
            DASHBOARD
          </h1>

         {messages.length>0 ? ( 
          messages.map((message) =>(
          <MessageCard key={(message?._id) as string} 
              message={message}
              onMessageDelete={handleDeleteMessages}
          />))):
        
          (<p>No Messages Found</p>)
        }

        </div>

        <div className="w-[25%] border-solid border-l-[1px] m-4 h-full p-4 border-white">
      
        <div className='w-full p-4 box-stroke-3 mb-10 h-[25vh] rounded-md bg-white'>
            <p className="text-xl  mt-2 mb-2 cursor-text font-semibold">Anonimy Link</p>
            <div className="bg-[#010409] p-4 rounded-md text-white overflow-hidden">{profileUrl}</div>  
            <Button className="mb-2 mt-2" onClick={copyToClipboard}>Copy URL</Button>  
        </div>
      
        <div className='w-full p-4 box-stroke-3 mb-4 h-[10vh] rounded-md bg-[#0D1117]'>
               
            <div className="flex justify-between items-center">
            <p className="text-xl text-white mt-2 mb-2 cursor-text font-semibold">Accepting Messages</p>
                 <Switch
          {...register('acceptMessages')}
          checked={isChecked}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />

            </div> 
        </div>
      
      </div>
    
    
    </div>
    </div>
  );
}

export default Dashboard;
