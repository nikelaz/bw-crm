import { Grid, GridColumn as Column, GridToolbar, GridSearchBox } from "@progress/kendo-react-grid";
import EmailsLayout from "../components/emails-layout";
import { FormLayout, FormField } from "../components/forms";
import { TextBox, TextArea } from "@progress/kendo-react-inputs";
import { Window, WindowActionsBar, Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import { saveIcon, clockArrowRotateIcon, trashIcon, plusIcon } from "@progress/kendo-svg-icons";
import { useStore } from "../store";
import { useState, useRef } from "react";

export default function EmailTemplates() {
  const emailTemplates = useStore((state) => state.emailTemplates);
  const getEmailTemplate = useStore((state) => state.getEmailTemplate);
  const [currentEmailTemplate, setCurrentEmailTemplate] = useState(null);
  const [isDetailsWindowVisible, setIsDetailsWindowVisible] = useState(false);
  const [deleteItemLabel, setDeleteItemLabel] = useState("");
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateWindowVisible, setIsCreateWindowVisible] = useState(false);
  const detailsForm = useRef(null);
  const createForm = useRef(null);

  const saveChanges = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    // Todo: actually save changes
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsErrorDialogVisible(true);
    setError("An error message");

    setIsLoading(false);
  }

  const toggleDetailsWindow = () => {
    setIsDetailsWindowVisible(!isDetailsWindowVisible);
  };

  const toggleErrorDialog = () => {
    setIsErrorDialogVisible(!isErrorDialogVisible);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogVisible(!isDeleteDialogVisible);
  };

  const toggleCreateWindow = () => {
    setIsCreateWindowVisible(!isCreateWindowVisible);
  };

  const deleteItemConfirm = () => {
    setDeleteItemLabel(
      `${currentEmailTemplate.title} (ID: ${currentEmailTemplate.id})`
    );
    toggleDeleteDialog();
  };

  const deleteItem = () => {
    console.log("deleting item");
    toggleDetailsWindow();
    toggleDeleteDialog();
  };

  const handleRowClick = (event) => {
    setCurrentEmailTemplate(getEmailTemplate(event.dataItem.id));
    setIsDetailsWindowVisible(true);
  };

  const createEmailTemplate = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    console.log("create email template", data);
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsLoading(false);
    toggleCreateWindow();
  }

  return (
    <>
      <EmailsLayout>
        <Grid 
          data={emailTemplates}
          dataItemKey="id"
          autoProcessData={true}
          resizable={true}
          sortable={true}
          reorderable={true}
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
            <Button
              svgIcon={plusIcon}
              onClick={toggleCreateWindow}
            >
              New Email Template 
            </Button>
          </GridToolbar>
          <Column
            field="id"
            title="ID"
            width="120px"
          />
          <Column
            field="title"
            title="Title"
          />
        </Grid>
      </EmailsLayout>

      { isCreateWindowVisible ? (
        <Window
          modal={true}
          minimizeButton={() => <></>}
          title="New Email Template"
          onClose={toggleCreateWindow}
          initialWidth={680}
          initialHeight={600}
        >
          <form ref={createForm} onSubmit={createEmailTemplate}>
            <FormLayout>
              <FormField label="Title" editorId="title"> 
                <TextBox
                  required
                  name="title"
                  id="title"
                />
              </FormField>

              <FormField label="Template Body" editorId="body"> 
                <TextArea
                  required
                  name="body"
                  id="body"
                  autoSize={true}
                  resizable="vertical"
                  rows={12}
                />
              </FormField>
            </FormLayout>
          </form>
          <WindowActionsBar layout="start">
            <Button
              svgIcon={isLoading ? clockArrowRotateIcon : saveIcon}
              disabled={isLoading}
              themeColor="primary"
              type="button"
              onClick={() => { createForm.current.requestSubmit(); }}
            >
              { isLoading ? "Creating Template" : "Create Template" }
            </Button>
          </WindowActionsBar>
        </Window>
      ) : null }

      { isDetailsWindowVisible ? (
        <Window
          modal={true}
          minimizeButton={() => <></>}
          title="Email Template Details"
          onClose={toggleDetailsWindow}
          initialWidth={680}
          initialHeight={680}
        >
          <form ref={detailsForm} onSubmit={saveChanges}>
            <FormLayout>
              <FormField label="ID" editorId="id"> 
                <TextBox
                  required
                  readOnly
                  name="id"
                  id="id"
                  value={currentEmailTemplate.id}
                />
              </FormField>

              <FormField label="Title" editorId="title"> 
                <TextBox
                  required
                  name="title"
                  id="title"
                  defaultValue={currentEmailTemplate.title}
                />
              </FormField>

              <FormField label="Template Body" editorId="body"> 
                <TextArea
                  name="body"
                  id="body"
                  autoSize
                  resizable="vertical"
                  rows={5}
                  defaultValue={currentEmailTemplate.body}
                />
              </FormField>
            </FormLayout>
          </form>
          <WindowActionsBar layout="start">
            <Button
              svgIcon={isLoading ? clockArrowRotateIcon : saveIcon}
              disabled={isLoading}
              themeColor="primary"
              type="button"
              onClick={() => { detailsForm.current.requestSubmit(); }}
            >
              { isLoading ? "Saving Changes" : "Save Changes" }
            </Button>
            <Button
              svgIcon={trashIcon}
              type="button"
              themeColor="error"
              onClick={deleteItemConfirm}
            >
              Delete Template
            </Button>
          </WindowActionsBar>
        </Window>
      ) : null }

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
