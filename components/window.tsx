import type { FC, PropsWithChildren } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

import { useConstrainRef, useSetWindows, useWindows } from "../state/windows";

const variants = {
  open: { opacity: 1, x: 200, scale: 1, height: 500, width: 500 },
  closed: { opacity: 0, x: "-100%", scale: 0.1, height: 50, width: 50 },
};

type WindowProps = {
  id: string;
};

const WindowContainer = styled(motion.div)`
  position: absolute;
  padding-top: 3rem;
`;

export const Window: FC<PropsWithChildren<WindowProps>> = ({
  id,
  children,
}) => {
  const windows = useWindows();
  const constrainRef = useConstrainRef();
  const setWindows = useSetWindows();

  const isOpen = windows[id]?.isOpen;

  const optional = constrainRef ? { dragConstraints: constrainRef } : {};

  return (
    <WindowContainer
      drag
      {...optional}
      dragMomentum={false}
      animate={isOpen ? "open" : "closed"}
      transition={{ ease: "easeInOut" }}
      variants={variants}
    >
      {isOpen && (
        <>
          <motion.button onClick={() => setWindows(id, { isOpen: false })}>
            x
          </motion.button>
          {children}
        </>
      )}
    </WindowContainer>
  );
};
