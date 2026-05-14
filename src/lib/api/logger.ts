import "server-only";

type BackendLogLevel = "debug" | "info" | "warn" | "error";

export interface BackendLogContext {
  route?: string;
  method?: string;
  status?: number;
  actorId?: string;
  message?: string;
  metadata?: Record<string, unknown>;
}

export interface ApiLogContext {
  route: string;
  method?: string;
  status?: number;
  actorId?: string;
  metadata?: Record<string, unknown>;
}

function getCause(error: unknown) {
  if (!error || typeof error !== "object" || !("cause" in error)) {
    return null;
  }

  const cause = (error as { cause?: unknown }).cause;

  return cause && typeof cause === "object" ? cause : null;
}

function sanitizeMessage(message: string) {
  if (message.startsWith("Failed query:")) {
    return "Database query failed.";
  }

  return message;
}

function serializeErrorObject(error: unknown) {
  if (!error || typeof error !== "object") {
    return null;
  }

  const errorWithDetails = error as Error & {
    code?: unknown;
    detail?: unknown;
    details?: unknown;
    hint?: unknown;
    constraint?: unknown;
    constraint_name?: unknown;
  };

  return {
    name: errorWithDetails.name,
    message:
      typeof errorWithDetails.message === "string"
        ? sanitizeMessage(errorWithDetails.message)
        : undefined,
    code: errorWithDetails.code,
    detail: errorWithDetails.detail,
    details: errorWithDetails.details,
    hint: errorWithDetails.hint,
    constraint: errorWithDetails.constraint ?? errorWithDetails.constraint_name,
  };
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    const cause = getCause(error);

    return {
      ...serializeErrorObject(error),
      cause: serializeErrorObject(cause),
    };
  }

  return error;
}

function writeBackendLog(
  logLevel: BackendLogLevel,
  context: BackendLogContext,
  error?: unknown
) {
  const payload = {
    timestamp: new Date().toISOString(),
    logLevel,
    runtime: "backend",
    ...context,
    error: error === undefined ? undefined : serializeError(error),
  };
  const serialized = JSON.stringify(payload, null, 2);

  if (logLevel === "error") {
    console.error(serialized);
    return;
  }

  if (logLevel === "warn") {
    console.warn(serialized);
    return;
  }

  console.log(serialized);
}

export function logBackendInfo(context: BackendLogContext) {
  writeBackendLog("info", context);
}

export function logBackendWarning(context: BackendLogContext, error?: unknown) {
  writeBackendLog("warn", context, error);
}

export function logBackendError(error: unknown, context: BackendLogContext) {
  writeBackendLog("error", context, error);
}

export function logApiError(error: unknown, context: ApiLogContext) {
  logBackendError(error, context);
}
