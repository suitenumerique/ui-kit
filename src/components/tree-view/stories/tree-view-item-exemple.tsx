import {
  TreeViewItem,
  TreeViewNodeProps,
  TreeViewNodeTypeEnum,
} from ":/components/tree-view";
import { TreeViewExempleData } from "./tree-view-exemple";

import { useDropdownMenu } from ":/components/dropdown-menu/useDropdownMenu";

import { DropdownMenu } from ":/components/dropdown-menu/DropdownMenu";
import { Button } from "@openfun/cunningham-react";

type TreeViewItemExempleProps = TreeViewNodeProps<TreeViewExempleData> & {
  loadChildren: (node: TreeViewExempleData) => Promise<TreeViewExempleData[]>;
  deleteNode: (id: string) => void;
};

export const TreeViewItemExemple = ({
  loadChildren,
  deleteNode,
  ...props
}: TreeViewItemExempleProps) => {
  const { isOpen, setIsOpen } = useDropdownMenu();

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
      callback: () => alert("Renommer"),
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
      callback: () => deleteNode(props.node.id),
      showSeparator: true,
    },
  ];

  return (
    <TreeViewItem {...props} loadChildren={(node) => loadChildren(node)}>
      {props.node.data.value.type === TreeViewNodeTypeEnum.TITLE ||
      props.node.data.value.type === TreeViewNodeTypeEnum.SEPARATOR ? null : (
        <div className={"tree-view-item"}>
          <div className={`container`}>
            <span className="name">{props.node.data.value.name}</span>
            <div className={`actions ${isOpen ? "show-actions" : ""}`}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <DropdownMenu
                  onOpenChange={setIsOpen}
                  isOpen={isOpen}
                  options={options}
                >
                  <Button size="small" onClick={() => setIsOpen(!isOpen)}>
                    Open
                  </Button>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      )}
    </TreeViewItem>
  );
};
