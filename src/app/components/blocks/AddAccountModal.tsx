import { memo, useCallback } from "react";
import classNames from "clsx";
import * as Dialog from "@radix-ui/react-dialog";
import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";

import { AddAccountStep } from "app/defaults";
import { addAccountModalAtom, addAccountStepAtom } from "app/atoms";
import { OverflowProvider } from "app/hooks";
import NewButton from "app/components/elements/NewButton";
import BackButton from "app/components/elements/BackButton";
import ScrollAreaContainer from "app/components/elements/ScrollAreaContainer";
import AddAccountSteps from "app/components/blocks/AddAccountSteps";
import { ReactComponent as VigvamIcon } from "app/icons/Vigvam.svg";

const AddAccountModal = memo(() => {
  const [accModalOpened, setAccModalOpened] = useAtom(addAccountModalAtom);
  const accountStep = useAtomValue(addAccountStepAtom);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setAccModalOpened([open, "replace"]);
    },
    [setAccModalOpened]
  );

  return (
    <Dialog.Root open={accModalOpened} onOpenChange={handleOpenChange} modal>
      <Dialog.Portal>
        <>
          <Dialog.Overlay
            className={classNames("fixed inset-0 z-20", "bg-brand-darkblue/50")}
          />
          <div
            className={classNames(
              "flex items-center justify-center",
              "w-[6.5rem] h-[6.5rem]",
              "rounded-full",
              "bg-brand-dark/10",
              "backdrop-blur-[30px]",
              "border border-brand-light/5",
              "shadow-addaccountmodal",
              "absolute",
              "top-[12.5%] left-1/2",
              "-translate-x-1/2 -translate-y-1/2",
              "z-30"
            )}
          >
            <VigvamIcon className="w-16 mt-2" />
          </div>
          <OverflowProvider>
            {(ref) => (
              <Dialog.Content
                onOpenAutoFocus={(e) => e.preventDefault()}
                className={classNames(
                  "fixed z-20",
                  "h-3/4 w-full max-w-6xl min-w-[40rem]",
                  "m-auto inset-x-0 inset-y-0",
                  "rounded-[2.5rem]",
                  "overflow-hidden"
                )}
                ref={ref}
              >
                <ScrollAreaContainer
                  className={classNames(
                    "w-full h-full",
                    "bg-brand-dark/10",
                    "backdrop-blur-[30px]",
                    "border border-brand-light/5",
                    "rounded-[2.5rem]",
                    "overflow-hidden",
                    "after:absolute after:inset-0",
                    "after:shadow-addaccountmodal",
                    "after:rounded-[2.5rem]",
                    "after:pointer-events-none",
                    "after:z-30"
                  )}
                  scrollBarClassName={classNames(
                    "pt-[4.25rem]",
                    "!right-1",
                    accountStep === AddAccountStep.ChooseWay
                      ? "pb-[3.25rem]"
                      : "pb-28"
                  )}
                  type="scroll"
                >
                  {accountStep !== AddAccountStep.ChooseWay && (
                    <BackButton className="fixed top-4 left-4 " />
                  )}

                  <Dialog.Close className="fixed top-4 right-4" asChild>
                    <NewButton theme="clean">Cancel</NewButton>
                  </Dialog.Close>

                  {accModalOpened && <AddAccountSteps />}
                </ScrollAreaContainer>
              </Dialog.Content>
            )}
          </OverflowProvider>
        </>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

export default AddAccountModal;
