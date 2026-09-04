import { ToastContainer, Slide } from "react-toastify";

export type ToastProviderProps = {
  position?:
    | "top-right"
    | "top-center"
    | "top-left"
    | "bottom-right"
    | "bottom-center"
    | "bottom-left";
  stacked?: boolean;
  containerId?: string;
};

export const ToastProvider = ({
  position = "bottom-left",
  stacked = true,
  containerId,
}: ToastProviderProps) => {
  return (
    <ToastContainer
      className="c__toast-container"
      toastClassName="c__toast"
      position={position}
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeOnClick={false}
      closeButton={false}
      draggable={false}
      transition={Slide}
      stacked={stacked}
      containerId={containerId}
    />
  );
};
