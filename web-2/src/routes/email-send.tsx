import EmailsLayout from "../components/emails-layout";
import { useStore } from "../store";
import { FormLayout, FormField } from "../components/forms";
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { TextBox, TextArea } from "@progress/kendo-react-inputs";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import {
  listUnorderedOutlineIcon,
  paperPlaneIcon,
  clockArrowRotateIcon,
} from "@progress/kendo-svg-icons";

export default function EmailSend() {
  const contacts = useStore(state => state.contacts);

  // TODO: value/label separation here
  const contactsDropdown = contacts.map(contact =>
    `${contact.first_name} ${contact.last_name} <${contact.email}>`);

  return (
    <EmailsLayout>
      <form style={{ maxWidth: "680px" }}>
        <FormLayout>
          <FormField label="Contact" editorId="contact"> 
            <DropDownList
              name="contact"
              id="contact"
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
              svgIcon={paperPlaneIcon}
              type="submit"
              themeColor="primary"
            >
              Send
            </Button>
          </div>
        </FormLayout>
      </form>
    </EmailsLayout>
  );
}
