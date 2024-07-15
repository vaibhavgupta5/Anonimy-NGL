"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useToast } from "@/components/ui/use-toast"
import { verifySchema } from "@/schemas/verifySchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from 'zod';

function VerifyAccount () {

    const router = useRouter()
    const params = useParams<{username: string}>()
    const [isSubmitting, setisSubmitting] = useState(false)
    const {toast} = useToast()

    const form = useForm({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
          },
        },
      )

      const onSubmit = async (data: z.infer<typeof verifySchema>) =>{
        try {
            setisSubmitting(true)
            const result = await axios.post(`/api/verifycode`, {username: params.username, 
                code: data.code
            })

            console.log(data)

            toast({
                title: "Success",
                description: "Code Verified!",
              })
              setisSubmitting(false)
            router.replace("/signin")
        } catch (error:any) {
            setisSubmitting(true)
            console.error(error)
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message
            
            toast({
              title: "SignUp Failed",
              description: errorMessage,
              variant: "destructive",
            })
            setisSubmitting(false)
          }
      }

      return (
        <div className="flex justify-center items-center h-[100vh] bg-[#0D1117]">
    
          <p className="fixed text-[30vh] text-white font-extrabold opacity-[1] z-[1]  text-stroke-3 text-center leading-[12rem] ">VERIFY<br/>ANONIMY</p>
    
        <div className="bg-white m-4 p-8  box-stroke-3 z-[20]">
    
        <div className="text-3xl text-center font-extrabold text-[#0D1117]">VERIFY YOUR ACCOUNT</div>
    
        <hr className="w-full border-[1px] border-[#0D1117] opacity-[0.5] mb-4 mt-4"/>
    
        <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:w-[50vh] max-md:w-[100%] ">

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="text-center flex flex-col justify-center items-center">
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field} >
                  <InputOTPGroup >
                    <InputOTPSlot className="bg-[#0D1117] border-[1px] border-solid border-white text-white" index={0} />
                    <InputOTPSlot className="bg-[#0D1117] border-[1px] text-white border-solid border-white" index={1} />
                    <InputOTPSlot className="bg-[#0D1117] border-[1px] text-white border-solid border-white"  index={2} />
                    <InputOTPSlot className="bg-[#0D1117] border-[1px] text-white border-solid border-white"  index={3} />
                    <InputOTPSlot className="bg-[#0D1117] border-[1px] text-white border-solid border-white"  index={4} />
                    <InputOTPSlot className="bg-[#0D1117] border-[1px] text-white border-solid border-white"  index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
 
    
        <Button className="w-full p-8 text-lg bg-[#0D1117] font-semibold" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
            <Loader2 className="animate-spin"/>Please Wait
            </>
          ) : (<>SUBMIT</>)}
        </Button>
          </form>
        </Form>
        </div>
        </div>
      )
    }
export default VerifyAccount