import AnalyzeForm from "@/components/AnalyzeForm";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl p-8">
      <h1 className="text-3xl font-bold">SiteScope</h1>
      <p className="mt-2 mb-8 text-zinc-600">
        Check the performance, accessibility and SEO of any website.
      </p>
      <AnalyzeForm />
    </main>
  );
}
