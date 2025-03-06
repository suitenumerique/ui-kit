/* eslint-disable react-hooks/exhaustive-deps */
import { Data, useDroppable } from "@dnd-kit/core";
import { useEffect } from "react";

type DroppableProps<T> = {
  id: string;
  onOver?: (isOver: boolean, data?: Data<T>) => void;
  data?: Data<T>;
  children: React.ReactNode;
};

export const Droppable = <T,>(props: DroppableProps<T>) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: props.data,
  });

  useEffect(() => {
    props.onOver?.(isOver, props.data);
  }, [isOver, props.data, props.onOver]);

  return <div ref={setNodeRef}>{props.children}</div>;
};
