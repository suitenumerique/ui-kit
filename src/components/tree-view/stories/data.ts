import { TreeViewNodeTypeEnum } from "../types";
import { TreeViewExempleData } from "./tree-view-exemple";

export const complexTreeData: TreeViewExempleData[] = [
    {
      id: "Espace personnel",
      nodeType: TreeViewNodeTypeEnum.TITLE,
      headerTitle: "Espace personnel",
    },
    {
      id: "1",
      name: "Je suis ",
      childrenCount: 0,
      nodeType: TreeViewNodeTypeEnum.NODE,
      children: [],
    },
    { id: "2", name: "Threads", childrenCount: 0, nodeType: TreeViewNodeTypeEnum.NODE, children: [] },
    { id: "2.1", name: "load subItems", childrenCount: 1, nodeType: TreeViewNodeTypeEnum.NODE, children: [] },
    {
      id: "SEPARATOR_1",
      nodeType: TreeViewNodeTypeEnum.SEPARATOR,
    },
    {
      id: "Espace partagé",
      nodeType: TreeViewNodeTypeEnum.TITLE,
      headerTitle: "Espace partagé",
    },
    {
      id: "3",
      name: "Chat Rooms",
      nodeType: TreeViewNodeTypeEnum.NODE,
      childrenCount: 3,
      children: [
        { id: "c1", name: "General", childrenCount: 0, nodeType: TreeViewNodeTypeEnum.NODE, children: [] },
        { id: "c2", name: "Random", childrenCount: 0, nodeType: TreeViewNodeTypeEnum.NODE, children: [] },
        {
          id: "c3",
          name: "Open Source Projects",
          nodeType: TreeViewNodeTypeEnum.NODE,
          childrenCount: 0,
          children: [],
        },
      ],
    },
    {
      id: "4",
      name: "Direct Messages",
      nodeType: TreeViewNodeTypeEnum.NODE,
      childrenCount: 3, 
      children: [
        { id: "d1", name: "Alice", childrenCount: 0, nodeType: TreeViewNodeTypeEnum.NODE, children: [] },
        { id: "d2", name: "Bob", childrenCount: 0, nodeType: TreeViewNodeTypeEnum.NODE, children: [] },
        { id: "d3", name: "Charlie", childrenCount: 0, nodeType: TreeViewNodeTypeEnum.NODE, children: [] },
        { id: "d4", name: "Charlie", childrenCount: 0, nodeType: TreeViewNodeTypeEnum.NODE, children: [] },
        { id: "d5", name: "Charlie", childrenCount: 0, nodeType: TreeViewNodeTypeEnum.NODE, children: [] },
        { id: "d6", name: "Charlie", childrenCount: 0, nodeType: TreeViewNodeTypeEnum.NODE, children: [] },
        { id: "d7", name: "Charlie", childrenCount: 0, nodeType: TreeViewNodeTypeEnum.NODE, children: [] },
        { id: "d8", name: "Charlie", childrenCount: 0, nodeType: TreeViewNodeTypeEnum.NODE, children: [] },
        { id: "d9", name: "Charlie", childrenCount: 0, nodeType: TreeViewNodeTypeEnum.NODE, children: [] },
        { id: "d10", name: "Charlie", childrenCount: 0, nodeType: TreeViewNodeTypeEnum.NODE, children: [] },
        
      ],
    },
    {
      id: "5",
      name: "Node 5",
      nodeType: TreeViewNodeTypeEnum.NODE,
      childrenCount: 0,
      children: [],
    },
    {
      id: "6",
      name: "Node 6",
      nodeType: TreeViewNodeTypeEnum.NODE,
      childrenCount: 0,
      children: [],
    },
  ];


  export const simpleTreeData: TreeViewExempleData[] = [
    {
      id: "simple.1",
      name: "Node 1",
      nodeType: TreeViewNodeTypeEnum.NODE,
      childrenCount: 0,
      children: [],
    },
    {
      id: "simple.2",
      name: "Node 2",
      nodeType: TreeViewNodeTypeEnum.NODE,
      childrenCount: 0,
      children: [],
    },
    {
      id: "simple.3",
      name: "Node 3",
      nodeType: TreeViewNodeTypeEnum.NODE,
      childrenCount: 0,
      children: [],
    },
    {
      id: "simple.4",
      name: "Node 4",
      nodeType: TreeViewNodeTypeEnum.NODE,
      childrenCount: 0,
      children: [],
    },
  ];

  export const paginatedTreeData: TreeViewExempleData[] = [
    {
      id: "paginated.1",
      name: "Node avec enfants paginés",
      nodeType: TreeViewNodeTypeEnum.NODE,
      childrenCount: 25, // 25 enfants au total
      children: [], // Pas d'enfants pré-chargés
    },
    {
      id: "paginated.2",
      name: "Node avec peu d'enfants",
      nodeType: TreeViewNodeTypeEnum.NODE,
      childrenCount: 3, // 3 enfants au total
      children: [], // Pas d'enfants pré-chargés
    },
    {
      id: "paginated.3",
      name: "Node sans enfants",
      nodeType: TreeViewNodeTypeEnum.NODE,
      childrenCount: 0,
      children: [],
    },
  ];

  export const simpleWithChildrenTreeData: TreeViewExempleData[] = [
    {
      id: "1",
      name: "Node 1",
      nodeType: TreeViewNodeTypeEnum.NODE,
      childrenCount: 0,
      children: [],
    },
    {
      id: "2",
      name: "Node 2",
      nodeType: TreeViewNodeTypeEnum.NODE,
      childrenCount: 2,
      children: [
        {
          id: "2.1",
          name: "Node 2.1",
          nodeType: TreeViewNodeTypeEnum.NODE,
          childrenCount: 0,
          children: [],
        },
        {
          id: "2.2",
          name: "Node 2.2",
          nodeType: TreeViewNodeTypeEnum.NODE,
          childrenCount: 0,
          children: [],
        },
      ],
    },
    {
      id: "3",
      name: "Node 3",
      nodeType: TreeViewNodeTypeEnum.NODE,
      childrenCount: 0,
      children: [],
    },
    
  ];
