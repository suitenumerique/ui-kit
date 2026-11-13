import { useCallback, useEffect, useMemo } from "react";
import { useCunningham } from ":/components/provider";
import { GenericSupportForm } from "../generic-support-form/GenericSupportForm";
import {
  GenericSupportFormData,
  GenericSupportFormLabels,
} from "../generic-support-form/types";
import { LaSuiteSupportFormProps } from "./types";
import {
  SUPPORT_ACCEPTED_FILE_TYPES,
  SUPPORT_MAX_FILE_SIZE,
  SUPPORT_MAX_FILES,
  useLaSuiteSupportApi,
} from "./useLaSuiteSupportApi";

/**
 * Contact form wired to the La Suite support API: it validates the form,
 * passes the anti-spam check, sends the request and shows the result.
 *
 * It is a GenericSupportForm with the support API's rules: the email is required
 * (unless `email` is given), and one png, jpg, gif or txt file up to 10 MB can
 * be attached.
 */
export const LaSuiteSupportForm = ({
  api,
  channel,
  email,
  onSuccess,
  onError,
  labels: labelsOverride,
  isOpen,
  ...formProps
}: LaSuiteSupportFormProps) => {
  const { t } = useCunningham();
  const { send, prepare } = useLaSuiteSupportApi({ api, channel });

  // Run the anti-spam check while the user writes, not when they click Send.
  useEffect(() => {
    if (isOpen) prepare();
  }, [isOpen, prepare]);

  const handleSend = useCallback(
    async (data: GenericSupportFormData) => {
      try {
        await send(data);
      } catch (error) {
        // The check was used by this attempt: prepare one for the retry.
        prepare();
        onError?.(error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
      onSuccess?.();
    },
    [send, prepare, onSuccess, onError],
  );

  const labels = useMemo<Partial<GenericSupportFormLabels>>(
    () => ({
      uploadHint: t("components.laSuiteSupportForm.uploadHint"),
      successText: t("components.laSuiteSupportForm.successText"),
      ...labelsOverride,
    }),
    [labelsOverride, t],
  );

  return (
    <GenericSupportForm
      {...formProps}
      isOpen={isOpen}
      email={email}
      requireEmail
      maxFiles={SUPPORT_MAX_FILES}
      maxFileSize={SUPPORT_MAX_FILE_SIZE}
      acceptedFileTypes={SUPPORT_ACCEPTED_FILE_TYPES}
      labels={labels}
      onSend={handleSend}
    />
  );
};
