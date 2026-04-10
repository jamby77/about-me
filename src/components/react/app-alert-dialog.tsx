"use client";

import { useState, type ComponentProps, type ReactElement, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Button } from "@/components/ui/button";

type ButtonVariant = NonNullable<ComponentProps<typeof Button>["variant"]>;

type CommonProps = {
  /** The element rendered as the dialog's trigger button. Cloned with the trigger's onClick. */
  trigger: ReactElement;
  /** Heading shown at the top of the dialog. */
  title: ReactNode;
  /** Optional supporting copy under the title. */
  description?: ReactNode;
  /** Label of the cancel button. Defaults to "Cancel". */
  cancelLabel?: string;
  /** Label of the primary action button. */
  actionLabel: string;
  /** Visual variant of the action button. Defaults to "default". */
  actionVariant?: ButtonVariant;
  /** Optional controlled open state. If omitted, the dialog manages its own. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type CallbackProps = CommonProps & {
  /** Fired when the user confirms. The dialog auto-closes after the callback runs. */
  onAction: () => void;
  submitForm?: never;
};

type FormProps = CommonProps & {
  /**
   * HTML id of the form to submit when the user confirms. The action button uses
   * the HTML5 `form="…"` attribute, so the form can live anywhere in the DOM.
   * Browser navigation after the POST closes the dialog implicitly.
   */
  submitForm: string;
  onAction?: never;
};

export type AppAlertDialogProps = CallbackProps | FormProps;

function isFormProps(props: AppAlertDialogProps): props is FormProps {
  return typeof (props as FormProps).submitForm === "string";
}

export function AppAlertDialog(props: AppAlertDialogProps) {
  const {
    trigger,
    title,
    description,
    cancelLabel = "Cancel",
    actionLabel,
    actionVariant = "default",
  } = props;

  const [internalOpen, setInternalOpen] = useState(false);
  const open = props.open ?? internalOpen;
  const setOpen = props.onOpenChange ?? setInternalOpen;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          {isFormProps(props) ? (
            <AlertDialogAction
              type="submit"
              form={props.submitForm}
              variant={actionVariant}
            >
              {actionLabel}
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              type="button"
              variant={actionVariant}
              onClick={() => {
                props.onAction();
                setOpen(false);
              }}
            >
              {actionLabel}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
