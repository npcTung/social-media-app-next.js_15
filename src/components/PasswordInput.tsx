"use client";

import React, { useState } from "react";
import {
  Input,
  InputProps,
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "./ui";
import { cn } from "@/lib/utils";
import icons from "@/lib/icons";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

const { Eye, EyeOff } = icons;

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pe-10", className)}
          ref={ref}
          {...props}
        />
        <div className="absolute right-2 top-2 text-gray-500">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger
                asChild
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                {showPassword ? "Hiden password" : "Show password"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
