import Link from "next/link";

/** A System 7 alert over the desktop. */
export default function NotFound() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div
        role="alertdialog"
        aria-labelledby="not-found-message"
        className="w-[22rem] max-w-full border border-black bg-white p-1 shadow-[4px_4px_0_#000]"
      >
        <div className="flex gap-4 border-[3px] border-black p-4 font-chicago text-sm">
          <svg className="size-8 shrink-0" viewBox="0 0 32 32" aria-hidden>
            <path d="M10 2h12l8 8v12l-8 8H10l-8-8V10z" fill="black" />
            <path d="M16 8v11" stroke="white" strokeWidth="3" />
            <circle cx="16" cy="24" r="1.8" fill="white" />
          </svg>
          <div className="flex flex-1 flex-col gap-4">
            <p id="not-found-message">Sorry, the item you asked for couldn’t be found.</p>
            <Link
              href="/"
              className="self-end rounded-md border border-black px-6 py-0.5 shadow-[0_0_0_1px_#fff,0_0_0_3px_#000] active:bg-black active:text-white"
            >
              OK
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
