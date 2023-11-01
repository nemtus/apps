"use client";

import { supabase } from "@/lib/supabase";

export default function AccountPage(): JSX.Element {
  supabase.auth.getSession().then((e) => {
    console.log(e.data, e.error);
  });

  return <div>test</div>;
}
