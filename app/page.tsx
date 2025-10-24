import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="w-full lg:absolute">
        <div className="flex flex-col-reverse pl-6 pr-10 py-2 md:flex-row md:justify-between">
          <div className="flex flex-col-reverse items-center justify-center gap-2 my-10 md:my-2 md:flex-row md:justify-start md:m-0">
            <h1 className="text-[2.2rem] text-center uppercase">Maneki Neko</h1>
            <Image
              src="/paw.svg"
              alt=""
              width={40}
              height={40}
              priority
              className="dark:invert"
            />
          </div>
          <div className="flex items-center gap-5 md:gap-10 mt-3 md:mt-0">
            <Link className="hover:text-red" href="/login">
              Login
            </Link>
            <Link className="hover:text-red" href="/signup">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex grow justify-center">
        <div className="md:grid md:grid-cols-2 lg:grid lg:grid-cols-3 md:gap-15">
          <div className="flex flex-col justify-center items-center text-center md:pl-10 lg:pr-10 md:items-start md:text-left">
            <div className="py-2 md:pl-8 lg:border-l">
              <p className="text-2xl mb-5">
                Keep track of your
                <br />
                <strong>income</strong> and <strong>expenses</strong>.
              </p>
              <p className="text-2xl">
                Take charge of your <strong>money</strong>
                <br />
                with confidence.
              </p>
            </div>
            <div className="mt-8 md:ml-8">
              <Link
                href="/signup"
                className="p-3 border rounded-sm hover:border-red hover:text-red"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center my-10 lg:my-0">
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-red w-[300px] h-[300px] lg:w-[340px] lg:h-[340px]"></div>
              <Image
                src="/manekineko.png"
                alt="manekineko"
                width={340}
                height={255}
                priority
                className="absolute max-w-74 lg:max-w-140 h-auto"
              />
            </div>
          </div>

          <div className="bg-gray-200/30 dark:bg-[#050505]/60 col-span-2 flex items-center justify-center px-10 py-15 md:py-10 mt-20 md:mt-0 lg:col-span-1 lg:justify-end lg:p-20 lg:bg-transparent lg:dark:bg-transparent">
            <div className="w-full text-center text-lg md:w-[80%] lg:w-[160px] lg:text-justify">
              <p className="mb-4">
                <strong className="text-2xl">招き猫</strong>
                <br />
                <strong className="text-xl">Maneki Neko</strong>
                <br />
                <em className="text-sm">lit. beckoning cat</em>
              </p>
              <p>
                A Japanese lucky cat statue, often seen waving in shops and
                homes. Legend says its raised paw invites wealth and happiness.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
