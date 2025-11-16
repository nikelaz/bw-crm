import { Grid, GridColumn as Column, GridToolbar, GridSearchBox } from "@progress/kendo-react-grid";
import { FormLayout, FormField } from "../components/forms";
import EmailsLayout from "../components/emails-layout";
import { Window, WindowActionsBar, Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { TextBox, TextArea } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { useStore } from "../store";
import { useState } from "react";
import { saveIcon, clockArrowRotateIcon, trashIcon, plusIcon } from "@progress/kendo-svg-icons";

function formatEmail(email) {
  return {
    ...email,
    from: `${email.from_name} <${email.from_email}>`,
    to: `${email.to_name} <${email.to_email}>`,
  };
};

const formatEmails = (emails) => {
  return emails.map(formatEmail);
};

export default function Emails() {
  const emails = useStore((state) => state.emails);
  const getEmail = useStore((state) => state.getEmail);
  const formattedEmails = formatEmails(emails);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [isDetailsWindowVisible, setIsDetailsWindowVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [deleteItemLabel, setDeleteItemLabel] = useState("");

  const handleRowClick = (event) => {
    setCurrentEmail(formatEmail(
      getEmail(event.dataItem.id)
    ));
    setIsDetailsWindowVisible(true);
  };

  const toggleDetailsWindow = () => {
    setIsDetailsWindowVisible(!isDetailsWindowVisible);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogVisible(!isDeleteDialogVisible);
  };

  const deleteItemConfirm = () => {
    setDeleteItemLabel(
      `${currentEmail.subject} (ID: ${currentEmail.id})`
    );
    toggleDeleteDialog();
  };

  const deleteItem = () => {
    console.log("deleting item");
    toggleDetailsWindow();
    toggleDeleteDialog();
  };

  return (
    <>
      <EmailsLayout>
        <Grid 
          data={formattedEmails}
          dataItemKey="id"
          autoProcessData={true}
          resizable={true}
          sortable={true}
          reorderable={true}
          filterable={true}
          defaultTake={30}
          pageable={{
            pageSizes: [10, 20, 30, 50]
          }}
          style={{ height: "100%" }}
          className="row-cursor-pointer"
          onRowClick={handleRowClick}
        >
          <GridToolbar>
            <GridSearchBox style={{ width: "320px" }} />
          </GridToolbar>
          <Column
            field="id"
            title="ID"
            filterable={false}
            width="120px"
          />
          <Column
            field="date"
            title="Date"
            filterable={false}
          />
          <Column
            field="from"
            title="From"
            filterable={true}
          /> 
          <Column
            field="to"
            title="To"
            filterable={true}
          />
        </Grid>
      </EmailsLayout>

      { isDetailsWindowVisible ? (
        <Window
          modal={true}
          minimizeButton={() => <></>}
          title="Email Details"
          onClose={toggleDetailsWindow}
          initialWidth={680}
          initialHeight={720}
        >
          <FormLayout>
            <FormField label="ID" editorId="id"> 
              <TextBox
                readOnly
                name="id"
                id="id"
                value={currentEmail.id}
              />
            </FormField>

            <FormField label="From" editorId="from"> 
              <TextBox
                readOnly
                name="from"
                id="from"
                value={currentEmail.from}
              />
            </FormField>

            <FormField label="To" editorId="to"> 
              <TextBox
                readOnly
                name="To"
                id="to"
                value={currentEmail.to}
              />
            </FormField>

            <FormField label="Subject" editorId="subject"> 
              <TextBox
                readOnly={true}
                name="subject"
                id="subject"
                value={currentEmail.subject}
              />
            </FormField>

            <FormField label="Body" editorId="body"> 
              <TextArea
                readOnly
                name="body"
                id="body"
                autoSize
                rows={5}
                value={currentEmail.body}
              />
            </FormField>             
          </FormLayout>
          <WindowActionsBar layout="start">
            <Button
              svgIcon={trashIcon}
              type="button"
              themeColor="error"
              onClick={deleteItemConfirm}
            >
              Delete Email
            </Button>
          </WindowActionsBar>
        </Window>
      ) : null }


      { isDeleteDialogVisible ? (
        <Dialog title="Delete Confirmation" onClose={toggleDeleteDialog} width={480}>
          <p>You are about to delete <strong>{deleteItemLabel}</strong>.</p>
          <p>Are you sure?</p>
          <DialogActionsBar>
            <Button
              type="button"
              onClick={toggleDeleteDialog}
            >
              Cancel
            </Button>
            <Button
              type="button"
              themeColor="error"
              onClick={deleteItem}
            >
              Yes, Delete
            </Button>
          </DialogActionsBar>
        </Dialog>
      ) : null }
    </>
  );
}
