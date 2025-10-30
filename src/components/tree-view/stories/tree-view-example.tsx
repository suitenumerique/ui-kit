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

import svg from "./logo-example.svg";
import { TreeViewItemExample } from "./tree-view-item-example";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import clsx from "clsx";
import { useTreeContext } from "../providers/TreeContext";

export type ExampleData = {
  name: string;
};

export type TreeViewExampleData = TreeViewDataType<ExampleData>;

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

type TreeViewExampleProps = {
  treeData: TreeViewExampleData[];
  withRightPanel?: boolean;
};
export const TreeViewExample = ({
  treeData,
  withRightPanel = false,
}: TreeViewExampleProps) => {
  const treeContext = useTreeContext<TreeViewExampleData>();

  const [draggingData, setDraggingData] = useState<TreeViewExampleData | null>(
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
    return JSON.parse(JSON.stringify(treeData)) as TreeViewExampleData[];
  }, [treeData]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id && active.id) {
      if (over.id === active.id) {
        return;
      }
      const overId = over.id.toString();
      const data = active.data.current as TreeViewExampleData;
      const nodeApi = over.data.current
        ?.nodeApi as NodeApi<TreeViewExampleData>;

      treeContext?.treeData.addChild(overId, data);
      listData.remove(active.id);
      if (nodeApi) {
        nodeApi.open();
      }
    }
    return;
  };

  return (
    <>
      <DndContext
        onDragStart={(event) => {
          setDraggingData(event.active.data.current as TreeViewExampleData);
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
            <div>
              <TreeView
                rootNodeId="ROOT_NODE_ID"
                selectedNodeId={"1"}
                renderNode={TreeViewItemExample}
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
                    {draggingData?.nodeType === undefined ||
                    draggingData?.nodeType === TreeViewNodeTypeEnum.NODE
                      ? draggingData?.name
                      : ""}
                  </div>
                </DragOverlay>
              </div>
            </div>
          )}
          <button onClick={() => treeContext?.treeData.resetTree(data)}>
            Reset
          </button>
        </MainLayout>
      </DndContext>
    </>
  );
};

type FolderProps = {
  folder: TreeViewExampleData;
};
const Folder = ({ folder }: FolderProps) => {
  const [isOver, setIsOver] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  if (folder.nodeType && folder.nodeType !== TreeViewNodeTypeEnum.NODE) {
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
