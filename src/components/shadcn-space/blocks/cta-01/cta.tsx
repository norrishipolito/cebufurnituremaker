import Link from "next/link";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProjectCta() {
  return (
    <section className="border-y border-gray-200 bg-gray-50 px-4 py-14 dark:border-gray-800 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase text-amber-700 dark:text-amber-300">
          Start your custom piece
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
          Ready to shape a piece that feels made for your space?
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300 sm:text-base">
          Share the room, measurements, and finish you have in mind. We will help turn the idea into furniture built with care in Cebu.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/#contact">
              <MessageSquareText />
              Discuss Your Project
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/#projects">
              Browse More Work
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
