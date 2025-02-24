import { useResponsive } from ":/hooks/useResponsive";
import clsx from "clsx";
import { PropsWithChildren } from "react";

export type LeftPanelProps = {
  isOpen?: boolean;
};
export const LeftPanel = ({
  children,
  isOpen = false,
}: PropsWithChildren<LeftPanelProps>) => {
  const { isDesktop } = useResponsive();

  if (!isDesktop) {
    return (
      <div
        className={clsx("c__left-panel__mobile", {
          open: isOpen,
        })}
      >
        {children}
      </div>
    );
  }

  return <div className="c__left-panel">{children}</div>;
};

// {!isDesktop && (
//   <>
//     {isPanelOpen && <MobileLeftPanelStyle />}
//     <Box
//       $hasTransition
//       $css={css`
//         z-index: 999;
//         width: 100dvw;
//         height: calc(100dvh - 52px);
//         border-right: 1px solid var(--c--theme--colors--greyscale-200);
//         position: fixed;
//         transform: translateX(${isPanelOpen ? '0' : '-100dvw'});
//         background-color: var(--c--theme--colors--greyscale-000);
//       `}
//     >
//       <Box
//         data-testid="left-panel-mobile"
//         $css={css`
//           width: 100%;
//           justify-content: center;
//           align-items: center;
//           gap: ${spacings['base']};
//         `}
//       >
//         <LeftPanelHeader />
//         <LeftPanelContent />
//         <SeparatedSection showSeparator={false}>
//           <Box $justify="center" $align="center" $gap={spacings['sm']}>
//             <ButtonLogin />
//             <LanguagePicker />
//           </Box>
//         </SeparatedSection>
//       </Box>
//     </Box>
//   </>
// )}
