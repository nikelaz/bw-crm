import { useState } from "react";
import EmailsLayout from "../components/emails-layout";
import { useStore } from "../store";
import { FormLayout, FormField } from "../components/forms";
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { TextBox, TextArea } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import {
  paperPlaneIcon,
  clockArrowRotateIcon,
} from "@progress/kendo-svg-icons";

export default function EmailSend() {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [error, setError] = useState("");
  const contacts = useStore(state => state.contacts);

  // TODO: value/label separation here
  const contactsDropdown = contacts.map(contact => ({
    id: contact.id,
    label: `${contact.first_name} ${contact.last_name} <${contact.email}>`
  }));

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    console.log("data", data);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    toggleErrorDialog();
    setError("Test error");

    setIsLoading(false);
  }

  const toggleErrorDialog = () => {
    setIsErrorDialogVisible(!isErrorDialogVisible);
  };

  return (
    <EmailsLayout>
      <form onSubmit={handleFormSubmit} style={{ maxWidth: "680px" }}>
        <FormLayout>
          <FormField label="Contact" editorId="contact"> 
            <DropDownList
              name="contact"
              id="contact"
              dataItemKey="id"
              textField="label"
              data={contactsDropdown}
            />
          </FormField>

          <FormField label="Subject" editorId="subject"> 
            <TextBox
              required
              name="subject"
              id="subject"
            />
          </FormField>

          <FormField label="Body" editorId="body"> 
            <TextArea
              name="body"
              id="body"
              autoSize={true}
              resizable="vertical"
              rows={10}
            />
          </FormField>

          <div>
            <Button
              svgIcon={isLoading ? clockArrowRotateIcon : paperPlaneIcon}
              disabled={isLoading}
              type="submit"
              themeColor="primary"
            >
              { isLoading ? "Sending Email" : "Send Email" }
            </Button>
          </div>

          { isErrorDialogVisible ? (
            <Dialog title="Error" onClose={toggleErrorDialog} width={480}>
              <p>{error}</p>
              <DialogActionsBar>
                <Button type="button" onClick={toggleErrorDialog}>
                  Ok
                </Button>
              </DialogActionsBar>
            </Dialog>
          ) : null}

        </FormLayout>
      </form>
    </EmailsLayout>

  );
}
