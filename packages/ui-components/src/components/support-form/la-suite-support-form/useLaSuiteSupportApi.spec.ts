import { beforeEach, describe, expect, it, vi } from "vitest";
import { createElement, ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { CunninghamProvider } from ":/components/provider";
import {
  sendLaSuiteSupportRequest,
  useLaSuiteSupportApi,
} from "./useLaSuiteSupportApi";
import { solveAltchaChallenge } from "./altcha";

vi.mock("./altcha", () => ({
  solveAltchaChallenge: vi.fn(),
}));

const messages = { error: "Generic error", altchaFailed: "Anti-spam failed" };
const data = {
  subject: "Bug",
  message: "It does not work",
  email: "jean@example.gouv.fr",
};

describe("sendLaSuiteSupportRequest", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    vi.mocked(solveAltchaChallenge).mockReset();
    vi.mocked(solveAltchaChallenge).mockResolvedValue({
      payload: "altcha-payload",
    });
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("posts the request to {api}deliver/ with the channel header", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

    await sendLaSuiteSupportRequest({
      api: "https://support.test/api/support",
      channel: "docs",
      minDuration: 0,
      data,
      messages,
    });

    // A missing trailing slash is added to the base URL.
    expect(solveAltchaChallenge).toHaveBeenCalledWith(
      "https://support.test/api/support/challenge",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://support.test/api/support/deliver/");
    expect(init?.method).toBe("POST");
    expect(init?.headers).toEqual({
      "Content-Type": "application/json",
      "X-Channel-ID": "docs",
    });
    expect(JSON.parse(init?.body as string)).toEqual({
      subject: "Bug",
      textBody: "It does not work",
      email: "jean@example.gouv.fr",
      channel: "docs",
      altcha: "altcha-payload",
      notify_sender: true,
      attachments: [],
    });
  });

  it("sends attachments in base64, without the data URL prefix", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });
    const untyped = new File(["hi"], "photo.PNG");

    await sendLaSuiteSupportRequest({
      api: "https://support.test/api/support/",
      channel: "docs",
      minDuration: 0,
      data: { ...data, files: [file, untyped] },
      messages,
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.attachments).toEqual([
      { fileName: "notes.txt", mimeType: "text/plain", data: btoa("hello") },
      // No type from the browser: it is guessed from the extension.
      { fileName: "photo.PNG", mimeType: "image/png", data: btoa("hi") },
    ]);
  });

  it("rejects with the API detail when the request is refused", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ success: false, detail: "Too many requests." }),
      { status: 429 },
    );

    await expect(
      sendLaSuiteSupportRequest({
        api: "https://support.test/api/support/",
        channel: "docs",
        minDuration: 0,
        data,
        messages,
      }),
    ).rejects.toThrow("Too many requests.");
  });

  it("rejects with the generic message when the response is not JSON", async () => {
    fetchMock.mockResponseOnce("<html>Bad gateway</html>", { status: 502 });

    await expect(
      sendLaSuiteSupportRequest({
        api: "https://support.test/api/support/",
        channel: "docs",
        minDuration: 0,
        data,
        messages,
      }),
    ).rejects.toThrow("Generic error");
  });

  it("rejects with the generic message on a network failure", async () => {
    fetchMock.mockRejectOnce(new TypeError("Failed to fetch"));

    await expect(
      sendLaSuiteSupportRequest({
        api: "https://support.test/api/support/",
        channel: "docs",
        minDuration: 0,
        data,
        messages,
      }),
    ).rejects.toThrow("Generic error");
  });

  it("does not send the request when the anti-spam check fails", async () => {
    vi.mocked(solveAltchaChallenge).mockRejectedValueOnce(
      new Error("Unsupported ALTCHA challenge."),
    );

    await expect(
      sendLaSuiteSupportRequest({
        api: "https://support.test/api/support/",
        channel: "docs",
        minDuration: 0,
        data,
        messages,
      }),
    ).rejects.toThrow("Anti-spam failed");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("waits at least minDuration, even when the request fails", async () => {
    vi.useFakeTimers();
    try {
      fetchMock.mockResponseOnce(JSON.stringify({ success: false }));
      const onSettled = vi.fn();
      const promise = sendLaSuiteSupportRequest({
        api: "https://support.test/api/support/",
        channel: "docs",
        minDuration: 1500,
        data,
        messages,
      }).catch(onSettled);

      await vi.advanceTimersByTimeAsync(1000);
      expect(onSettled).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(600);
      await promise;
      expect(onSettled).toHaveBeenCalledWith(new Error("Generic error"));
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("useLaSuiteSupportApi", () => {
  const api = "https://support.test/api/support/";
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(CunninghamProvider, null, children);
  const renderApi = () =>
    renderHook(
      () => useLaSuiteSupportApi({ api, channel: "docs", minDuration: 0 }),
      {
        wrapper,
      },
    ).result.current;
  const sentPayload = (call: number) =>
    JSON.parse(fetchMock.mock.calls[call][1]?.body as string).altcha;

  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ success: true }));
    vi.mocked(solveAltchaChallenge).mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("sends with the solution prepared in advance", async () => {
    vi.mocked(solveAltchaChallenge).mockResolvedValue({ payload: "prepared" });
    const { send, prepare } = renderApi();

    // Preparing twice runs the check once.
    prepare();
    prepare();
    await send(data);

    expect(solveAltchaChallenge).toHaveBeenCalledTimes(1);
    expect(sentPayload(0)).toBe("prepared");
  });

  it("never uses a prepared solution twice", async () => {
    vi.mocked(solveAltchaChallenge)
      .mockResolvedValueOnce({ payload: "first" })
      .mockResolvedValueOnce({ payload: "second" });
    const { send, prepare } = renderApi();

    prepare();
    await send(data);
    await send(data);

    expect(sentPayload(0)).toBe("first");
    expect(sentPayload(1)).toBe("second");
  });

  it("solves a new challenge when the prepared one expires soon", async () => {
    vi.mocked(solveAltchaChallenge)
      .mockResolvedValueOnce({ payload: "stale", expiresAt: Date.now() + 1000 })
      .mockResolvedValueOnce({ payload: "fresh" });
    const { send, prepare } = renderApi();

    prepare();
    await send(data);

    expect(solveAltchaChallenge).toHaveBeenCalledTimes(2);
    expect(sentPayload(0)).toBe("fresh");
  });

  it("solves a new challenge when the prepared one failed", async () => {
    vi.mocked(solveAltchaChallenge)
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce({ payload: "fresh" });
    const { send, prepare } = renderApi();

    prepare();
    await send(data);

    expect(solveAltchaChallenge).toHaveBeenCalledTimes(2);
    expect(sentPayload(0)).toBe("fresh");
  });

  it("solves the challenge on send when nothing was prepared", async () => {
    vi.mocked(solveAltchaChallenge).mockResolvedValue({ payload: "on-send" });
    const { send } = renderApi();

    await send(data);

    expect(solveAltchaChallenge).toHaveBeenCalledWith(`${api}challenge`);
    expect(sentPayload(0)).toBe("on-send");
  });
});
