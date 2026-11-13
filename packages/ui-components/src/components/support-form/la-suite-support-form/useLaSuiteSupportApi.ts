import { useCallback, useRef } from "react";
import { useCunningham } from ":/components/provider";
import { GenericSupportFormData } from "../generic-support-form/types";
import { AltchaSolution, solveAltchaChallenge } from "./altcha";
import {
  LaSuiteSupportAttachment,
  LaSuiteSupportRequestBody,
  UseLaSuiteSupportApiOptions,
} from "./types";

const DEFAULT_MIN_DURATION_MS = 1500;

// Limits enforced by the support API (mailport).
export const SUPPORT_MAX_FILES = 1;
export const SUPPORT_MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIME_TYPES_BY_EXTENSION: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".txt": "text/plain",
};
export const SUPPORT_ACCEPTED_FILE_TYPES = [
  ...new Set(Object.values(MIME_TYPES_BY_EXTENSION)),
  ...Object.keys(MIME_TYPES_BY_EXTENSION),
];

const getMimeType = (file: File) => {
  if (file.type) return file.type;
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return MIME_TYPES_BY_EXTENSION[extension] ?? "application/octet-stream";
};

const readAsBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      resolve(dataUrl.slice(dataUrl.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const readAttachments = (
  files: File[] = [],
): Promise<LaSuiteSupportAttachment[]> =>
  Promise.all(
    files.map(async (file) => ({
      fileName: file.name,
      mimeType: getMimeType(file),
      data: await readAsBase64(file),
    })),
  );

const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));

// A prepared solution is used only if it stays valid this long after send.
const EXPIRY_MARGIN_MS = 60_000;

const challengeUrl = (api: string) =>
  `${api.endsWith("/") ? api : `${api}/`}challenge`;

const solvePayload = (api: string) =>
  solveAltchaChallenge(challengeUrl(api)).then(({ payload }) => payload);

type SendLaSuiteSupportRequestOptions = UseLaSuiteSupportApiOptions & {
  data: GenericSupportFormData;
  messages: { error: string; altchaFailed: string };
  /** Returns the anti-spam payload. Defaults to solving a new challenge. */
  getAltchaPayload?: () => Promise<string>;
};

/**
 * Sends a support request to the La Suite support API. Resolves when the API
 * accepts it, rejects with a user-facing message otherwise.
 */
export const sendLaSuiteSupportRequest = async ({
  api,
  channel,
  minDuration = DEFAULT_MIN_DURATION_MS,
  data,
  messages,
  getAltchaPayload = () => solvePayload(api),
}: SendLaSuiteSupportRequestOptions): Promise<void> => {
  const baseUrl = api.endsWith("/") ? api : `${api}/`;
  const startedAt = Date.now();
  const waitMinDuration = () => wait(minDuration - (Date.now() - startedAt));

  try {
    const [altcha, attachments] = await Promise.all([
      getAltchaPayload().catch((error) => {
        console.error(error);
        throw new Error(messages.altchaFailed);
      }),
      readAttachments(data.files),
    ]);

    const body: LaSuiteSupportRequestBody = {
      subject: data.subject,
      textBody: data.message,
      email: data.email ?? "",
      channel,
      altcha,
      notify_sender: true,
      attachments,
    };

    let result: { success?: boolean; detail?: string } | undefined;
    try {
      const response = await fetch(`${baseUrl}deliver/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Channel-ID": channel,
        },
        body: JSON.stringify(body),
      });
      result = await response.json();
    } catch (error) {
      // Network failure or a response that is not JSON.
      console.error(error);
      throw new Error(messages.error);
    }

    if (!result?.success) {
      throw new Error(result?.detail || messages.error);
    }
    await waitMinDuration();
  } catch (error) {
    await waitMinDuration();
    throw error;
  }
};

type PreparedAltcha = {
  api: string;
  solution: Promise<AltchaSolution>;
  /** Set once the solution failed or has been used: prepare a new one. */
  unusable?: boolean;
};

const isUsable = (prepared: PreparedAltcha | null, api: string) =>
  !!prepared && prepared.api === api && !prepared.unusable;

/**
 * Talks to the La Suite support API.
 *
 * - `send(data)` posts a GenericSupportForm's data. Pass it as `onSend` to a
 *   GenericSupportForm to build a custom support form, or use
 *   `LaSuiteSupportForm`, which does it for you.
 * - `prepare()` starts the anti-spam check ahead of time, e.g. when the form
 *   opens, so `send` doesn't wait for it. Optional: without it, `send`
 *   runs the check itself.
 */
export const useLaSuiteSupportApi = ({
  api,
  channel,
  minDuration,
}: UseLaSuiteSupportApiOptions) => {
  const { t } = useCunningham();
  const prepared = useRef<PreparedAltcha | null>(null);

  const prepare = useCallback(() => {
    if (isUsable(prepared.current, api)) return;
    const entry: PreparedAltcha = {
      api,
      solution: solveAltchaChallenge(challengeUrl(api)),
    };
    // A failed check is not an error yet: send() runs a new one.
    entry.solution.catch(() => {
      entry.unusable = true;
    });
    prepared.current = entry;
  }, [api]);

  const getAltchaPayload = useCallback(async () => {
    const entry = isUsable(prepared.current, api) ? prepared.current : null;
    // A solution works only once, so it is never handed out twice.
    prepared.current = null;
    if (entry) {
      entry.unusable = true;
      try {
        const { payload, expiresAt } = await entry.solution;
        if (!expiresAt || expiresAt - Date.now() > EXPIRY_MARGIN_MS) {
          return payload;
        }
      } catch {
        // The prepared check failed: run a new one below.
      }
    }
    return solvePayload(api);
  }, [api]);

  const send = useCallback(
    (data: GenericSupportFormData) =>
      sendLaSuiteSupportRequest({
        api,
        channel,
        minDuration,
        data,
        messages: {
          error: t("components.genericSupportForm.error"),
          altchaFailed: t("components.laSuiteSupportForm.altchaFailed"),
        },
        getAltchaPayload,
      }),
    [api, channel, minDuration, t, getAltchaPayload],
  );

  return { send, prepare };
};
