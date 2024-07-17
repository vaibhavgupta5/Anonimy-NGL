"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { messageSchema } from "@/schemas/messageSchema";
import UserModel from "@/model/User";

const SendMessage = () => {
  const [isAccepting, setisAccepting] = useState(true);

  const params = useParams<{ username: string }>();
  const person = params?.username;

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
      createdAt: Date.now(),
    },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const result = await axios.post("/api/send-message", {
        username: params.username,
        content: data.content,
        createdAt: Date.now(),
      });
    } catch (error: any) {
      toast({
        title: `${params.username} is not accepting message`,
        variant: "destructive",
      });
      setisAccepting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-[#0D1117]">
      <p className="fixed text-[10vh] md:text-[30vh] text-white font-extrabold opacity-[.8] z-[1]  text-stroke-3 text-center leading-[12rem] ">
        SEND
        <br />
        ANONIMY
      </p>

      <div className="bg-white m-4 p-8  box-stroke-3 z-[20]">
        <div className="text-3xl text-center font-extrabold text-[#0D1117]">
          SEND ANONIMY TO {person}
        </div>

        <hr className="w-full border-[1px] border-[#0D1117] opacity-[0.5] mb-4 mt-4" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-[100%] "
          >
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className=" w-full text-[16px]"
                      placeholder="Type your message here..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full p-8 text-lg bg-[#0D1117] font-semibold"
              type="submit"
              disabled={!isAccepting}
            >
              {isAccepting === false ? (
                `${params.username} is not Accepting Messages`
              ) : (
                <>SEND MESSAGE</>
              )}
            </Button>
          </form>
        </Form>
        <p className="text-center mt-4">
          Want to make your own Anonimy?{" "}
          <Link href="/signup" className="font-semibold underline">
            SIGNUP
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default SendMessage;
