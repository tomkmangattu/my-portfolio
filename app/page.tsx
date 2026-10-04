import Terminal from "./Terminal";


export default function Home() {
  return <main>
    <div className="h-dvh w-full bg-[url('/ubuntu_bg.jpg')] bg-cover bg-center bg-no-repeat p-3 sm:p-8">
      <Terminal/>
    </div>
  </main>;
}