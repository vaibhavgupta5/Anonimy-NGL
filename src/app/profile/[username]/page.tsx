"use client";
import { Button } from "@/components/ui/button";
import { User2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

function Profile() {
  const params = useParams<{ username: string }>();
  
  const { data: session } = useSession()
   

  return (
    <div className="flex justify-center items-center h-[100vh] bg-[#0D1117]">
    

      <div className="bg-white m-8 md:p-12 pt-4  md:w-[55%]  box-stroke-3 z-[20] w-full flex justify-center items-center md:flex-row flex-col">
        <div className=" w-[100%] md:w-[30%] flex justify-center items-baseline" >
            <User2 className="w-[30vh] text-white bg-[#0D1117] p-8 h-[30vh]"/>
        </div>
        <div className="text-3xl text-start font-extrabold text-[#0D1117] w-[100%] md:w-[70%] p-8">
          PROFILE OF {(params.username).toUpperCase()}
          <p className="text-black text-lg font-medium mt-4 text-wrap"><strong>Email:</strong> {session?.user.email}</p>
          <p className="text-black text-lg font-medium "><strong>Username:</strong> {session?.user.username}</p>
          <p className="text-black text-lg font-medium "><strong>Email Verified:</strong> {session?.user.isVerified ? "Yes" : "No"}</p>
          <Button variant="destructive" className="mt-4 pl-8 pr-8" onClick={() => signOut()}>Sign Out</Button>
        </div>
      </div>
    </div>
  );
}
export default Profile;
