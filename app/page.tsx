import Terminal from "./Terminal";


export default function Home() {
  return <main>
    <div className="min-h-dvh bg-linear-to-b from-[#B3281E] via-[#650F5C] to-[#2B0033]">
      <div className="h-dvh w-full bg-[url('/ubuntu_bg.avif')] bg-cover bg-center bg-no-repeat p-3 sm:p-8">
        <Terminal/>
      </div>
    </div>
  </main>;
}