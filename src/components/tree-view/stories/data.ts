import { TreeViewNodeTypeEnum } from "../types";
import { TreeViewExempleData } from "./tree-view-exemple";

export const complexTreeData: TreeViewExempleData[] = [
    {
      id: "Espace personnel",
      type: TreeViewNodeTypeEnum.TITLE,
      title: "Espace personnel",
    },
    {
      id: "1",
      name: "Je suis ",
      childrenCount: 0,
      type: TreeViewNodeTypeEnum.NODE,
      subItems: [],
    },
    { id: "2", name: "Threads", childrenCount: 0, type: TreeViewNodeTypeEnum.NODE, subItems: [] },
    { id: "2.1", name: "load subItems", childrenCount: 1, type: TreeViewNodeTypeEnum.NODE, subItems: [] },
    {
      id: "SEPARATOR_1",
      type: TreeViewNodeTypeEnum.SEPARATOR,
    },
    {
      id: "Espace partagé",
      type: TreeViewNodeTypeEnum.TITLE,
      title: "Espace partagé",
    },
    {
      id: "3",
      name: "Chat Rooms",
      type: TreeViewNodeTypeEnum.NODE,
      childrenCount: 3,
      subItems: [
        { id: "c1", name: "General", childrenCount: 0, type: TreeViewNodeTypeEnum.NODE, subItems: [] },
        { id: "c2", name: "Random", childrenCount: 0, type: TreeViewNodeTypeEnum.NODE, subItems: [] },
        {
          id: "c3",
          name: "Open Source Projects",
          type: TreeViewNodeTypeEnum.NODE,
          childrenCount: 0,
          subItems: [],
        },
      ],
    },
    {
      id: "4",
      name: "Direct Messages",
      type: TreeViewNodeTypeEnum.NODE,
      childrenCount: 3, 
      subItems: [
        { id: "d1", name: "Alice", childrenCount: 0, type: TreeViewNodeTypeEnum.NODE, subItems: [] },
        { id: "d2", name: "Bob", childrenCount: 0, type: TreeViewNodeTypeEnum.NODE, subItems: [] },
        { id: "d3", name: "Charlie", childrenCount: 0, type: TreeViewNodeTypeEnum.NODE, subItems: [] },
      ],
    },
  ];


  export const simpleTreeData: TreeViewExempleData[] = [
    {
      id: "simple.1",
      name: "Node 1",
      type: TreeViewNodeTypeEnum.NODE,
      childrenCount: 0,
      subItems: [],
    },
    {
      id: "simple.2",
      name: "Node 2",
      type: TreeViewNodeTypeEnum.NODE,
      childrenCount: 0,
      subItems: [],
    },
    {
      id: "simple.3",
      name: "Node 3",
      type: TreeViewNodeTypeEnum.NODE,
      childrenCount: 0,
      subItems: [],
    },
  ];

  export const simpleWithChildrenTreeData: TreeViewExempleData[] = [
    {
      id: "1",
      name: "Node 1",
      type: TreeViewNodeTypeEnum.NODE,
      childrenCount: 0,
      subItems: [],
    },
    {
      id: "2",
      name: "Node 2",
      type: TreeViewNodeTypeEnum.NODE,
      childrenCount: 2,
      subItems: [
        {
          id: "2.1",
          name: "Node 2.1",
          type: TreeViewNodeTypeEnum.NODE,
          childrenCount: 0,
          subItems: [],
        },
        {
          id: "2.2",
          name: "Node 2.2",
          type: TreeViewNodeTypeEnum.NODE,
          childrenCount: 0,
          subItems: [],
        },
      ],
    },
    {
      id: "3",
      name: "Node 3",
      type: TreeViewNodeTypeEnum.NODE,
      childrenCount: 0,
      subItems: [],
    },
  ];
