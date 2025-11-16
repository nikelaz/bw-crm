import { StackLayout } from "@progress/kendo-react-layout";
import { Label, Error } from "@progress/kendo-react-labels";

export function FormLayout(props) {
  return (
    <StackLayout orientation="vertical" gap={20}>
      {props.children}
    </StackLayout>
  );
}

export function FormField(props) {
  return (
    <StackLayout orientation="vertical" gap={5}>
      {props.label ? (
        <Label editorId={props.editorId}>{props.label}</Label>
      ) : null}
      {props.children}
      <Error>{props.error}</Error>
    </StackLayout>
  );
}
