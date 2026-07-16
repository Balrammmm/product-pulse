import { Navbar } from "@/components/Navbar";
import { UploadBox } from "@/components/UploadBox";

export default function UploadPage() {
  return (
    <main className="min-h-screen report-grid">
      <Navbar />
      <section className="px-5 py-10 sm:px-8 lg:py-16">
        <UploadBox />
      </section>
    </main>
  );
}
