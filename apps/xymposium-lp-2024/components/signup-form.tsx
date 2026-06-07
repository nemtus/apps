"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { H1, Paragraph } from "@/components/ui/typography";
import { navigations } from "@/lib/navigations";
import { cn } from "@/lib/utils";
import { IUser } from "@/types/user";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
  // isLoading / onSubmit は受付再開時に有効化する申込フォーム (下部の JSX を
  // コメントアウト中) から参照されるため、現状は未使用だが意図的に保持している。
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isFinished, setIsFinished] = React.useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    const form = event.currentTarget as HTMLFormElement & Record<string, HTMLInputElement>;
    const body: IUser = {
      email: form.email.value?.trim(),
      address: form.address.value?.replace(/-/g, "")?.trim(),
      phone: form.phoneNumber.value?.replace(/-/g, "")?.trim(),
      firstName: form.firstName.value?.trim(),
      lastName: form.lastName.value?.trim(),
    };

    if (!form.terms.value) {
      setIsLoading(false);
      return alert("You must agree to the terms of service to continue");
    }

    try {
      const result = await fetch("/api/sign_up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (result.ok) {
        alert("受付を完了しました。メールを確認下さい");
        setIsFinished(true);
      } else {
        const errorObj = await result.json();
        throw new Error(errorObj.message);
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
        alert(e.message);
      } else {
        alert("登録に失敗しました。再度やり直して下さい");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {isFinished ? (
        <Link href={navigations.index} variant={"outline"} size={"button"}>
          ホームへ戻る
        </Link>
      ) : (
        <Card className={"bg-background py-4 backdrop-blur-xs"} style={{ background: "hsla(0,0%,100%,.7)" }}>
          <CardContent className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <H1 className="pb-0 text-2xl font-semibold tracking-tight sm:text-2xl md:text-2xl">Apply for an event</H1>
              <Paragraph className="text-sm text-muted-foreground">Please enter the required information</Paragraph>
            </div>
            <div>
              <p className="px-16 py-4 text-center">受付を終了しました</p>
            </div>
            {/* <form onSubmit={onSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-2 grid-cols-2">
                  <div>
                    <Label className="sr-only" htmlFor="lastName">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      required={true}
                      placeholder="last name"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="family-name"
                      autoCorrect="off"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label className="sr-only" htmlFor="firstName">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      required={true}
                      placeholder="first name"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="given-name"
                      autoCorrect="off"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>
                  <Label className="sr-only" htmlFor="phoneNumber">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    required={true}
                    placeholder="phone number"
                    type="tel"
                    autoCapitalize="none"
                    autoComplete="tel"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                </div>
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
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label className="sr-only" htmlFor="text">
                    symbol address
                  </Label>
                  <Input
                    id="address"
                    required={false}
                    placeholder="(optional) symbol address"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="new-password"
                    disabled={isLoading}
                    pattern="N[A-Z0-9]{38}"
                    onInput={(e) => {
                      if (e.currentTarget.validity.patternMismatch) {
                        e.currentTarget.setCustomValidity("Please enter 39-digit symbol address without hyphens.");
                      } else {
                        e.currentTarget.setCustomValidity("");
                      }
                    }}
                  />
                </div>
                <div className="flex items-center justify-center space-x-2 py-3">
                  <Checkbox id="terms" required={true} disabled={isLoading} />
                  <Label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="terms"
                  >
                    Accept terms and conditions
                  </Label>
                </div>
                <Button disabled={isLoading}>
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Register
                </Button>
                <Paragraph className="text-center text-sm text-muted-foreground pt-2">
                  by clicking continue, you agree to our{" "}
                  <Link href="/terms#terms" className="underline text-sm underline-offset-4 hover:text-primary">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms#privacy" className="underline text-sm underline-offset-4 hover:text-primary">
                    Privacy Policy
                  </Link>
                </Paragraph>
              </div>
            </form> */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
