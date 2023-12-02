"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { H1, Paragraph } from "@/components/ui/typography";
import { navigations } from "@/lib/navigations";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignInForm({ className, ...props }: UserAuthFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassowrd] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const header = new Headers();
    header.append("Content-Type", "application/json");

    fetch("/api/auth/sign-in", {
      method: "POST",
      headers: header,
      body: JSON.stringify({ email, password }),
    })
      .then(() => {
        router.push(navigations.user.index);
      })
      .catch(() => {
        alert("登録に失敗しました。再度やり直して下さい");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Card className="py-4">
        <CardContent className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <H1 className="pb-0 text-2xl sm:text-2xl md:text-2xl font-semibold tracking-tight">Apply for an event</H1>
            <Paragraph className="text-sm text-muted-foreground">Enter your name, email and symbol address</Paragraph>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div>
                <Label className="sr-only" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  required={true}
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label className="sr-only" htmlFor="password">
                  Password
                </Label>
                <Input
                  id="password"
                  required={true}
                  placeholder="password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  autoCorrect="off"
                  onChange={(e) => setPassowrd(e.currentTarget.value)}
                  disabled={isLoading}
                />
              </div>
              <Button disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}Sign In with Email
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
