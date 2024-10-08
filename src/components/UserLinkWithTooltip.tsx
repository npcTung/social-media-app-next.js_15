"use client";

import kyInstance from "@/lib/ky";
import path from "@/lib/path";
import { UserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import Link from "next/link";
import React from "react";
import UserTooltip from "./UserTooltip";

interface UserLinkWithTooltip extends React.PropsWithChildren {
  userName: string;
}

export default function UserLinkWithTooltip({
  children,
  userName,
}: UserLinkWithTooltip) {
  const { data } = useQuery({
    queryKey: ["user-data", userName],
    queryFn: () =>
      kyInstance
        .get(`${path.API + path.USER}/${path.USER_NAME}/${userName}`)
        .json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404)
        return false;
      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  if (!data)
    return (
      <Link
        href={`/${path.USER}/${userName}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );

  return (
    <UserTooltip user={data}>
      <Link
        href={`/${path.USER}/${userName}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    </UserTooltip>
  );
}
