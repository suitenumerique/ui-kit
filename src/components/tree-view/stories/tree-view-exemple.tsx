import {
  TreeView,
  TreeViewDataType,
  TreeViewNodeTypeEnum,
} from ":/components/tree-view";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Draggable } from ":/components/dnd/Draggable";
import { Droppable } from ":/components/dnd/Droppable";
import { NodeApi } from "react-arborist";
import { useListData } from "react-stately";
import { useMemo, useState } from "react";
import { MainLayout } from ":/components/layout";

import svg from "./logo-exemple.svg";
import { TreeViewItemExemple } from "./tree-view-item-exemple";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { useTree } from "../useTree";
import clsx from "clsx";

export type ExempleData = {
  name: string;
};

export type TreeViewExempleData = TreeViewDataType<ExempleData>;

const containers = [
  {
    id: "Dossier A",
    name: "Dossier A",
    children: [],
    childrenCount: 0,
  },
  {
    id: "Dossier B",
    name: "Dossier B",
    children: [],
    childrenCount: 0,
  },
  {
    id: "Dossier C",
    name: "Dossier C",
    children: [],
    childrenCount: 0,
  },
];

type TreeViewExempleProps = {
  treeData: TreeViewExempleData[];
  withRightPanel?: boolean;
};
export const TreeViewExemple = ({
  treeData,
  withRightPanel = false,
}: TreeViewExempleProps) => {
  const [draggingData, setDraggingData] = useState<TreeViewExempleData | null>(
    null
  );
  const listData = useListData({
    initialItems: containers,
  });

  const activationConstraint = {
    distance: 20,
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const data = useMemo(() => {
    return JSON.parse(JSON.stringify(treeData)) as TreeViewExempleData[];
  }, [treeData]);

  const treeAria = useTree(
    data,
    async (id) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            name: "New " + id,
          });
        }, 1000);
      });
    },
    () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: "2.2.2",
              name: "children",
              childrenCount: 0,
              type: TreeViewNodeTypeEnum.NODE,
              subItems: [],
            },
          ]);
        }, 1000);
      });
    }
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id && active.id) {
      if (over.id === active.id) {
        return;
      }
      const overId = over.id.toString();
      const data = active.data.current as TreeViewExempleData;
      const nodeApi = over.data.current
        ?.nodeApi as NodeApi<TreeViewExempleData>;

      treeAria.addChild(overId, data);
      listData.remove(active.id);
      if (nodeApi) {
        nodeApi.open();
      }
    }
    return;
  };

  return (
    <DndContext
      onDragStart={(event) => {
        setDraggingData(event.active.data.current as TreeViewExempleData);
      }}
      sensors={sensors}
      modifiers={[snapCenterToCursor]}
      onDragEnd={onDragEnd}
      accessibility={{
        container: document.getElementById("root") ?? document.body,
      }}
    >
      <MainLayout
        enableResize
        leftPanelContent={
          <div style={{ paddingTop: 10, height: "100%" }}>
            <TreeView
              treeData={treeAria.nodes}
              rootNodeId="ROOT_NODE_ID"
              handleMove={treeAria.handleMove}
              renderNode={({ ...props }) => (
                <TreeViewItemExemple
                  loadChildren={(node) => treeAria.handleLoadChildren(node.id)}
                  deleteNode={treeAria.deleteNode}
                  {...props}
                />
              )}
            />
          </div>
        }
        icon={<img src={svg} alt="logo" />}
        languages={[
          { label: "Français", isChecked: true },
          { label: "Anglais" },
        ]}
      >
        {withRightPanel && (
          <div className="right-panel">
            <div>
              {listData.items.map((folder) => (
                <Folder key={folder.id} folder={folder} />
              ))}

              <DragOverlay>
                <div className="drag-overlay-item">
                  {draggingData?.type === undefined ||
                  draggingData?.type === TreeViewNodeTypeEnum.NODE
                    ? draggingData?.name
                    : ""}
                </div>
              </DragOverlay>
            </div>
          </div>
        )}
        <button onClick={() => treeAria.resetTree(data)}>Reset</button>
      </MainLayout>
    </DndContext>
  );
};

type FolderProps = {
  folder: TreeViewExempleData;
};
const Folder = ({ folder }: FolderProps) => {
  const [isOver, setIsOver] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  if (folder.type && folder.type !== TreeViewNodeTypeEnum.NODE) {
    return null;
  }

  return (
    <Droppable key={folder.id} id={folder.id} onOver={setIsOver}>
      <Draggable id={folder.id} data={{ ...folder }}>
        <div
          className={clsx("folder", {
            isSelected,
            isOver,
          })}
          onClick={() => setIsSelected(!isSelected)}
        >
          {folder.name}
        </div>
      </Draggable>
    </Droppable>
  );
};
