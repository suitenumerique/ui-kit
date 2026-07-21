import { useState } from "react";

export const useDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, setIsOpen };
};
