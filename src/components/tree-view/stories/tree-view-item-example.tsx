import {
  TreeViewItem,
  TreeViewNodeProps,
  TreeViewNodeTypeEnum,
} from ":/components/tree-view";
import { TreeViewExampleData, ExampleData } from "./tree-view-example";

import { useDropdownMenu } from ":/components/dropdown-menu/useDropdownMenu";

import { DropdownMenu } from ":/components/dropdown-menu/DropdownMenu";
import {
  Button,
  Input,
  Modal,
  ModalSize,
  useCunningham,
  useModal,
} from "@openfun/cunningham-react";
import { useTreeContext } from "../providers/TreeContext";
import { useArrowRoving } from ":/hooks/useArrowRoving";
import { useRef } from "react";

type TreeViewItemExampleProps = TreeViewNodeProps<ExampleData> & {};

export const TreeViewItemExample = ({ ...props }: TreeViewItemExampleProps) => {
  const { isOpen, setIsOpen } = useDropdownMenu();
  const { t } = useCunningham();

  const context = useTreeContext<TreeViewExampleData>();

  // Helper function to safely get the name property
  const getNodeName = (nodeValue: TreeViewExampleData): string => {
    let name = nodeValue.id;
    if (nodeValue.nodeType === TreeViewNodeTypeEnum.SIMPLE_NODE) {
      name = nodeValue.label;
    }
    if (nodeValue.nodeType === TreeViewNodeTypeEnum.NODE) {
      name = nodeValue.name;
    }
    return name;
  };
  const modal = useModal();
  const actionsRef = useRef<HTMLDivElement | null>(null);
  useArrowRoving(actionsRef.current);

  const options = [
    {
      icon: <span className="material-icons">info</span>,
      label: "Informations",
      callback: () => alert("Informations"),
    },
    {
      icon: <span className="material-icons">group</span>,
      label: "Partager",
      callback: () => alert("Partager"),
    },
    {
      icon: <span className="material-icons">download</span>,
      label: "Télécharger",
      callback: () => alert("Télécharger"),
      showSeparator: true,
    },
    {
      icon: <span className="material-icons">edit</span>,
      label: "Renommer",
      callback: modal.open,
      isChecked: true,
      showSeparator: true,
    },
    {
      icon: <span className="material-icons">arrow_forward</span>,
      label: "Déplacer",
      callback: () => alert("Déplacer"),
    },
    {
      icon: <span className="material-icons">arrow_back</span>,
      label: "Dupliquer",
      callback: () => alert("Dupliquer"),
    },
    {
      icon: <span className="material-icons">add</span>,
      isDisabled: true,
      label: "Crééer un raccourci",
      callback: () => alert("Crééer un raccourci"),
      showSeparator: true,
    },
    {
      icon: <span className="material-icons">delete</span>,
      label: "Supprimer",
      callback: () => context?.treeData.deleteNode(props.node.id),
      showSeparator: true,
    },
  ];

  const handleOpenMenu: React.MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <TreeViewItem {...props}>
        {props.node.data.value.nodeType === TreeViewNodeTypeEnum.TITLE ||
        props.node.data.value.nodeType ===
          TreeViewNodeTypeEnum.SEPARATOR ? null : (
          <div className={"tree-view-item"}>
            <div className={`container`}>
              <span className="name">{getNodeName(props.node.data.value)}</span>
              <div
                className={`actions ${isOpen ? "show-actions" : ""}`}
                ref={actionsRef}
                role="toolbar"
                aria-label={t("components.tree-view.node-actions")}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <DropdownMenu
                    onOpenChange={setIsOpen}
                    isOpen={isOpen}
                    options={options}
                  >
                    <Button size="nano" onClick={(e) => handleOpenMenu(e)}>
                      Open
                    </Button>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        )}
        {modal.isOpen && (
          <Modal {...modal} size={ModalSize.SMALL}>
            <div>
              <h1>Edit modal</h1>
              <Input />
            </div>
          </Modal>
        )}
      </TreeViewItem>
    </>
  );
};
