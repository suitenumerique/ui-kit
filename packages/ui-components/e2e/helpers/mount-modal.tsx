import { CunninghamProvider } from "../../src/components/provider/Provider";
import {
  Modal,
  ModalSize,
  ModalTab,
  useModal,
} from "../../src/components/modal/index";

const tabs: ModalTab[] = [
  {
    id: "general",
    label: "General",
    title: "General",
    content: <button>General action</button>,
  },
  {
    id: "privacy",
    label: "Privacy",
    title: "Privacy",
    content: "Privacy content",
  },
  {
    id: "notifications",
    label: "Notifications",
    title: "Notifications",
    content: "Notifications content",
  },
];

export const TestModal = ({
  locale = "en-US",
  titleIcon = false,
}: {
  locale?: string;
  titleIcon?: boolean;
}) => {
  const modal = useModal();
  return (
    <CunninghamProvider currentLocale={locale}>
      <button onClick={modal.open}>Open modal</button>
      <Modal
        {...modal}
        size={ModalSize.MEDIUM}
        title="Delete the file"
        subtitle="This action cannot be undone."
        titleIcon={
          titleIcon ? <span className="material-icons">warning</span> : undefined
        }
        rightActions={<button onClick={modal.close}>Confirm</button>}
      >
        <p>Modal content</p>
      </Modal>
    </CunninghamProvider>
  );
};

export const TestTabModal = () => {
  const modal = useModal();
  return (
    <CunninghamProvider>
      <button onClick={modal.open}>Open settings</button>
      <Modal
        {...modal}
        variant="tab"
        size={ModalSize.MEDIUM}
        sidebarTitle="Settings"
        tabs={tabs}
        rightActions={<button onClick={modal.close}>Save</button>}
      />
    </CunninghamProvider>
  );
};
