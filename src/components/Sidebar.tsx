"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth"; // pura session jata h User me
import Link from "next/link";

import { Button } from "./ui/button";

import { LifeBuoy, LogOut, Settings, Users } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

function Sidebar() {
  const { data: session } = useSession();

  const router = useRouter();
  const user: User = session?.user;

  return (
    <div className="flex justify-between items-center flex-col h-[100vh] w-[7%] bg-[#010409] pt-12 pb-12">
      <Link
        href={"/dashboard"}
        className="text-3xl line-through font-extrabold text-[#0D1117] text-center flex justify-center items-center h-14 w-14 box-stroke-3 bg-white rounded-md"
      >
        A
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-14 w-14  line-through font-extrabold text-[#0D1117] text-center flex justify-center items-center box-stroke-3 bg-white"
          >
            <Settings className="text-3xl" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 m-4 box-stroke-3 cursor-pointer">
          <DropdownMenuLabel>{`Hey, ${session?.user.username}`}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => router.replace(`/profile/${session?.user.username}`)}
              className="cursor-pointer"
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              router.push("https://github.com/vaibhavgupta5/Anonimy-with-AI")
            }
            className="cursor-pointer"
          >
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Sidebar;
