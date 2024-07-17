"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signUpSchema } from "@/schemas/signupSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setusernameMessage] = useState("");
  const [ischeckingUsername, setcheckingUsername] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  //zod implementation

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  //checking username unique
  useEffect(() => {
    const checkUsernameAvailable = async () => {
      if (username) {
        setcheckingUsername(true);
        setusernameMessage("");

        try {
          const result = await axios.get(
            `/api/check-username-unique?username=${username}`
          );

          setusernameMessage(result.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setusernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setcheckingUsername(false);
        }
      }
    };
    checkUsernameAvailable();
  }, [username]);

  //z.infer to validate from zod
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmitting(true);

    try {
      const result = await axios.post<ApiResponse>("/api/signup", data);


      toast({
        title: "Success",
        description: "You have successfully signed up",
      });

      setisSubmitting(false);
      // router.redirect("/verify");

      router.replace(`/verify/${username}`);
    } catch (error: any) {
      console.error(error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;

      toast({
        title: "SignUp Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setisSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-[#0D1117]">
      <p className="fixed text-[30vh] text-white font-extrabold opacity-[.8] z-[1]  text-stroke-3 text-center leading-[12rem] ">
        SIGNUP
        <br />
        ANONIMY
      </p>

      <div className="bg-white m-4 p-8  box-stroke-3 z-[20]">
        <div className="text-3xl text-center font-extrabold text-[#0D1117]">
          REGISTER TO ANONIMY
        </div>

        <hr className="w-full border-[1px] border-[#0D1117] opacity-[0.5] mb-4 mt-4" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:w-[50vh] max-md:w-[100%] "
          >
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="p-6 w-full text-[16px]"
                      placeholder="Username..."
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>

                  {ischeckingUsername && usernameMessage !== "" && (
                    <Loader2 className="animate-spin text-sm size-4 text-white" />
                  )}
                  <p
                    className={`text-sm text-wrap ${
                      usernameMessage === "Username exists"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="p-6 w-full text-[16px]"
                      placeholder="Email..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="p-6 w-full text-[16px]"
                      type="password"
                      placeholder="Password..."
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please Wait
                </>
              ) : (
                <>SIGN UP</>
              )}
            </Button>
          </form>
        </Form>
        <p className="text-center mt-4">
          Already Have Account?{" "}
          <Link href="/signin" className="font-semibold underline">
            SIGNIN
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Page;
