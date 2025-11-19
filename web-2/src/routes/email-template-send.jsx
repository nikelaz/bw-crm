import EmailsLayout from "../components/emails-layout";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { StackLayout } from "@progress/kendo-react-layout";
import { useStore } from "../store";
import { FormLayout, FormField } from "../components/forms";
import { SvgIcon } from "@progress/kendo-react-common";
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { useState } from "react";
import { TextArea } from "@progress/kendo-react-inputs";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import {
  userIcon,
  listUnorderedOutlineIcon,
  codeIcon,
  paperPlaneIcon,
  clockArrowRotateIcon,
  chevronLeftIcon,
  chevronRightIcon
} from "@progress/kendo-svg-icons";
import { Stepper } from "@progress/kendo-react-layout";
import { useLocation } from "wouter";

function renderEmailTemplate(template, contact) {
  if (!template || typeof template !== "string") return "";
  if (!contact || typeof contact !== "object") return template;

  return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
    const value = contact[key];
    return value !== undefined && value !== null ? String(value) : "";
  });
}

const steps = [
  { label: "Template", svgIcon: codeIcon },
  { label: "Contacts", svgIcon: userIcon },
  { label: "Preview and Send", svgIcon: paperPlaneIcon },
];

export default function EmailSend() {
  const [step, setStep] = useState(0);
  const emailTemplates = useStore(store => store.emailTemplates);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [previewFor, setPreviewFor] = useState(null);
  const contacts = useStore(store => store.contacts);
  const [isSendConfirmDialogVisible, setIsSendConfirmDialogVisible] = useState(false);
  const formattedContacts = contacts.map(contact => ({
    ...contact,
    formattedTitle: `${contact.first_name} ${contact.last_name} <${contact.email}>`
  }));
  const [_, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  const toggleSendConfirmDialog = () => {
    setIsSendConfirmDialogVisible(!isSendConfirmDialogVisible);
  }

  const changeTemplate = (event) => {
    setCurrentTemplate(event.value);
  }

  const onStepFormSubmit = (event, step) => {
    event.preventDefault();
    setStep(step + 1);
  };

  const back = () => {
    if (step === 0) return;
    setStep(step - 1);
  };

  const onContactsChange = (event) => {
    setSelectedContacts(event.value);
  };

  const confirmSend = (event) => {
    event.preventDefault();
    toggleSendConfirmDialog(); 
  }
  
  const sendEmails = async () => {
    setIsLoading(true);

    console.log("send emails");
    console.log("currentTemplate", currentTemplate);
    console.log("selectedContacts", selectedContacts);

    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsLoading(false);
    navigate("/emails");
  };

  return (
    <>
      <EmailsLayout>
        <div style={{ maxWidth: "960px" }}>
          <StackLayout orientation="horizontal" gap={60}>
            <div style={{ maxWidth: "280px" }}>
              <Stepper value={step} items={steps} orientation="vertical" />
            </div>
            { step === 0 ? (
              <form onSubmit={(event) => onStepFormSubmit(event, 0)}>
                <FormLayout>
                  <FormField label="Email Template" editorId="template"> 
                    <DropDownList
                      required
                      name="template"
                      id="template"
                      textField="title"
                      dataItemKey="id"
                      data={emailTemplates}
                      onChange={changeTemplate}
                    />
                  </FormField>

                  { currentTemplate ? (
                    <FormField label="Template Body" editorId="body"> 
                      <TextArea
                        readOnly
                        name="body"
                        id="body"
                        autoSize
                        value={currentTemplate.body}
                        rows={5}
                      />
                    </FormField>
                  ) : null }
                  <div>
                    <Button
                      type="submit"
                      themeColor="primary"
                      endIcon={<SvgIcon icon={chevronRightIcon} />}
                    >
                      Next: Select Contacts
                    </Button>
                  </div>
                </FormLayout>
              </form>
            ) : null}

            { step === 1 ? (
              <div>
                <FormLayout>
                  {/*
                <ButtonGroup>
                  <Button togglable={true} svgIcon={userIcon} selected={true}>
                    Contacts
                  </Button>
                  <Button togglable={true} svgIcon={listUnorderedOutlineIcon} selected={false}>
                    List of Contacts
                  </Button> 
                </ButtonGroup>
                */}

                  <form onSubmit={(event) => onStepFormSubmit(event, 1)}>
                    <FormLayout>
                      <FormField label="Contacts" editorId="contacts"> 
                        <MultiSelect
                          required
                          name="contacts"
                          id="contacts"
                          textField="formattedTitle"
                          dataItemKey="id"
                          data={formattedContacts}
                          onChange={onContactsChange}
                          value={selectedContacts}
                        />
                      </FormField>


                      <ButtonGroup>
                        <Button
                          type="button"
                          svgIcon={chevronLeftIcon}
                          onClick={back}
                        >
                          Previous: Select Template 
                        </Button>

                        <Button
                          type="submit"
                          themeColor="primary"
                          endIcon={<SvgIcon icon={chevronRightIcon} />}
                        >
                          Next: Preview and Send 
                        </Button>
                      </ButtonGroup>
                    </FormLayout>
                  </form>
                </FormLayout>
              </div>
            ) : null}

            { step === 2 ? (
              <form onSubmit={confirmSend}>
                <FormLayout>
                  <FormField label="Preview For:" editorId="preview-for"> 
                    <DropDownList
                      name="preview-for"
                      id="preview-for"
                      textField="formattedTitle"
                      dataItemKey="id"
                      data={selectedContacts}
                      onChange={(event) => setPreviewFor(event.value)}
                    />
                  </FormField>

                  { previewFor ? (
                    <FormField label="Email Body Preview:" editorId="preview-body"> 
                      <TextArea
                        readOnly
                        name="preview-body"
                        id="preview-body"
                        autoSize={true}
                        resizable="vertical"
                        rows={5}
                        value={renderEmailTemplate(currentTemplate.body, previewFor)}
                      />
                    </FormField>
                  ) : null }

                  <ButtonGroup>
                    <Button
                      type="button"
                      svgIcon={chevronLeftIcon}
                      onClick={back}
                    >
                      Previous: Select Contacts 
                    </Button>

                    <Button
                      type="submit"
                      themeColor="primary"
                      endIcon={<SvgIcon icon={paperPlaneIcon} />}
                    >
                      Send Emails 
                    </Button>
                  </ButtonGroup>
                </FormLayout>
              </form>
            ) : null }
          </StackLayout>
        </div>
      </EmailsLayout>

      { isSendConfirmDialogVisible ? (
        <Dialog title="Send Confirmation" onClose={toggleSendConfirmDialog} width={480}>
          <p>You are about to send <strong>{selectedContacts.length}</strong> emails.</p>
          <p>Are you sure?</p>
          <DialogActionsBar>
            <Button
              type="button"
              onClick={toggleSendConfirmDialog}
            >
              Cancel
            </Button>
            <Button
              svgIcon={isLoading ? clockArrowRotateIcon : paperPlaneIcon}
              type="button"
              themeColor="primary"
              onClick={sendEmails}
              disabled={isLoading}
            >
              { isLoading ? "Sending Emails" : "Send Emails" }
            </Button>
          </DialogActionsBar>
        </Dialog>
      ) : null }
    </>
  );
}
