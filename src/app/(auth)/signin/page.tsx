"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signinSchema";
import { signIn } from "next-auth/react";

const Signin = () => {
  const [isSubmitting, setisSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [expand, setExpand] = useState(false);


  //zod implementation

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  //z.infer to validate from zod
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setisSubmitting(true);

    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast({
        title: "SignUp Failed",
        description: result?.error,
        variant: "destructive",
      });
      setisSubmitting(false);
      return;
    }

    router.replace("/dashboard");
    

    setisSubmitting(false);

    toast({
      title: "Success",
      description: "You have successfully signed in",
    });
  };

  return (
    <div className="flex justify-center items-center h-[100vh] flex-col bg-[#0D1117]">
      <p className="fixed text-[10vh] md:text-[30vh] text-white font-extrabold opacity-[.8] z-[1]  text-stroke-3 text-center leading-[12rem] ">
        SIGNIN
        <br />
        ANONIMY
      </p>

      <div className="bg-white m-4 p-8  box-stroke-3 z-[20]">
        <div className="text-3xl text-center font-extrabold text-[#0D1117]">
          LOGIN TO ANONIMY
        </div>

        <hr className="w-full border-[1px] border-[#0D1117] opacity-[0.5] mb-4 mt-4" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:w-[50vh] max-md:w-[100%] "
          >
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="p-6 w-full text-[16px]"
                      placeholder="Username/Email..."
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
                <>SIGN IN</>
              )}
            </Button>
          </form>
        </Form>
        <p className="text-center mt-4">
          Do not Have Account?{" "}
          <Link href="/signup" className="font-semibold underline">
            SIGNUP
          </Link>{" "}
        </p>
      </div>

      <div className="bg-white m-4 p-8 flex justify-between items-center box-stroke-3 w-full z-[20] md:w-[28%]" onClick={()=> {expand ? setExpand(false): setExpand(true)}}>
      <p>Check Dummy Data </p>
      <p>{expand ? "▶":"▼"}</p>
      {expand && <p>
        <strong>Username : </strong>Vaibhav<br/>
        <strong>Password :</strong> 12345678 
      </p>}
        </div>
    </div>
  );
};

export default Signin;
