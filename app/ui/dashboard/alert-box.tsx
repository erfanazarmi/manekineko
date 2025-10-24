"use client";

export default function AlertBox({ message, close }: { message: string; close: () => void; }) {
  return (
    <div className="fixed top-0 left-0 h-dvh w-dvw bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
      <div className="bg-background max-w-[400px] w-full p-8 rounded-md">
        <p className="text-center">
          {message}
        </p>
        <button
          type="button"
          onClick={close}
          className="cursor-pointer text-white font-bold block bg-red rounded-md px-8 py-2 mx-auto mt-5"
        >
          OK
        </button>
      </div>
    </div>
  );
}
