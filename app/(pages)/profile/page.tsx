import { syncSupabaseUser } from "@/lib/syncUser";
import { supabaseClientServer } from "@/utils/supabase/server";
import Image from "next/image";

export default async function ProfilePage() {
  const supabase = await supabaseClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("User data: ", user);
  if (user) {
    await syncSupabaseUser(user);
  }
  const email = user?.email || "Customer";
  return (
    <main className="min-h-screen w-full bg-[#e8ebee] flex items-center  p-4 bg-[url('/bg-image.jpg')] bg-cover bg-center">
      <div className="w-full max-w-[980px] flex flex-col lg:flex-row items-center lg:items-end justify-end gap-10">
        <div className="w-full max-w-sm rounded-2xl shadow-lg">
          <div className="p-4 sm:p-6 space-y-4 bg-white/30 border border-white/40 rounded-lg shadow-lg backdrop-blur-3xl text-center">
            <div>
              <Image
                src="/logo.svg"
                alt="Logo"
                width={96}
                height={96}
                className="mx-auto"
              />
              <h1 className="mt-2 text-xl text-black font-bold">
                End to End Transit Solutions
              </h1>
              <br />
              <h1 className="mt-2 text-xl text-black font-bold">
                Welcome {email}
              </h1>
            </div>
          </div>
          <div />
        </div>
      </div>
    </main>
  );
}
