import Link from "next/link";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 text-5xl">✅</div>
      <h1 className="text-3xl font-bold text-[var(--heading)]">Booking Confirmed</h1>
      <p className="mt-3 max-w-xl text-[var(--body)]">
        Your booking has been created successfully. Keep this reference for support and trip updates.
      </p>
      <p className="mt-4 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--heading)]">
        Booking ID: {id}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/packages"
          className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Explore More Packages
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--body)] transition hover:bg-[var(--border)]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
