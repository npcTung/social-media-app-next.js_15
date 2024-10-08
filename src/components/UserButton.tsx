"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { logout } from "@/app/auth/actions";
import {
  UserAvatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components";
import icons from "@/lib/icons";
import path from "@/lib/path";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import Link from "next/link";

const { UserIcon, LogOutIcon, Monitor, Sun, Moon, Check } = icons;

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start">
        <DropdownMenuLabel className="cursor-default">{`Looged in as @${user.userName}`}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/${path.USER}/${user.userName}`}>
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="flex cursor-pointer items-center justify-between"
              >
                <div className="flex items-center justify-between">
                  <Monitor className="mr-2 size-4" />
                  System default
                </div>
                {theme === "system" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTheme("ligth")}
                className="flex cursor-pointer items-center justify-between"
              >
                <div className="flex items-center">
                  <Sun className="mr-2 size-4" />
                  Ligth
                </div>
                {theme === "ligth" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="flex cursor-pointer items-center justify-between"
              >
                <div className="flex items-center">
                  <Moon className="mr-2 size-4" />
                  Dark
                </div>
                {theme === "dark" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            queryClient.clear();
            logout();
          }}
          className="cursor-pointer"
        >
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
