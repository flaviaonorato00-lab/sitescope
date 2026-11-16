import AnalyzeForm from "@/components/AnalyzeForm";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          How healthy is your website?
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600">
          Paste any public address and get performance, accessibility, SEO and
          best-practices scores in seconds. No sign-up needed.
        </p>
      </div>
      <div className="mt-10">
        <AnalyzeForm />
      </div>
    </main>
  );
}
