import Image from "next/image"

export default function Home() {

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="p-2 max-w-xl">
        <div className="flex gap-2 text-neutral-500 mb-4">
          <Image src="/builtstack.svg" alt="BuiltStack Logo" width={20} height={20} color="#000"/>
          <h1>BuiltStack</h1>
        </div>
        <h2 className="mb-1 text-neutral-200 text-lg">To get started, edit the page.tsx file.</h2>
        <p className="text-neutral-400">
              A BuiltStack template to launch scalable web apps faster.
        </p>
        <ul className="my-4">
          <li><p className="text-sm text-neutral-500">Tech stack:</p></li>
          <li><p className="text-neutral-400 text-[15px]">NextJs app router</p></li>
          <li><p className="text-neutral-400 text-[15px]">Typescript</p></li>          
          <li><p className="text-neutral-400 text-[15px]">Neon with Prisma</p></li>
          <li><p className="text-neutral-400 text-[15px]">Better Auth</p></li>
          <li><p className="text-neutral-400 text-[15px]">Email Password</p></li>
          <li><p className="text-neutral-400 text-[15px]">Dodo Payments</p></li>
          <li><p className="text-neutral-400 text-[15px]">Resend</p></li>
        </ul>
        <ul className="my-4">
          <li><p className="text-sm text-neutral-500">Visit other pages:</p></li>
          <li><a href="/auth" className="text-neutral-400 hover:underline underline-offset-2">auth</a></li>
          <li><a href="" className="text-neutral-400 hover:underline underline-offset-2">pricing</a></li>
          <li><a href="" className="text-neutral-400 hover:underline underline-offset-2">dashboard</a></li>
        </ul>
      </div>
    </div>
  );
}
