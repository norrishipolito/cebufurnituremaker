import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logApiError, type ApiLogContext } from "./logger";

function getErrorPayload(error: Error) {
  const cause =
    "cause" in error && error.cause && typeof error.cause === "object"
      ? (error.cause as {
          message?: unknown;
          code?: unknown;
          detail?: unknown;
          details?: unknown;
          hint?: unknown;
          constraint?: unknown;
          constraint_name?: unknown;
        })
      : null;
  const source = cause ?? (error as Error & {
    code?: unknown;
    detail?: unknown;
    details?: unknown;
    hint?: unknown;
    constraint?: unknown;
    constraint_name?: unknown;
  });
  const rawMessage =
    typeof source.message === "string" ? source.message : error.message;
  const message = rawMessage.startsWith("Failed query:")
    ? "Database query failed."
    : rawMessage;

  return {
    error: message,
    code: source.code,
    detail: source.detail,
    details: source.details,
    hint: source.hint,
    constraint: source.constraint ?? source.constraint_name,
  };
}

export function jsonError(
  error: unknown,
  status = 500,
  context?: ApiLogContext
) {
  if (context) {
    logApiError(error, { ...context, status });
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", issues: error.issues },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(getErrorPayload(error), { status });
  }

  if (error && typeof error === "object") {
    const payload = error as {
      message?: unknown;
      details?: unknown;
      hint?: unknown;
      code?: unknown;
    };
    const message =
      typeof payload.message === "string"
        ? payload.message
        : "Unexpected error";

    return NextResponse.json(
      {
        error: message,
        details: payload.details,
        hint: payload.hint,
        code: payload.code,
      },
      { status }
    );
  }

  return NextResponse.json({ error: "Unexpected error" }, { status });
}

export function missingServiceConfig() {
  return NextResponse.json(
    { error: "Database configuration is missing. Set DATABASE_URL." },
    { status: 503 }
  );
}
