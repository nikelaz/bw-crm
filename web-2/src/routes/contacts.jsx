import MainLayout from "../components/main-layout";
import { Grid, GridColumn as Column, GridToolbar, GridSearchBox } from "@progress/kendo-react-grid";
import { Window, WindowActionsBar, Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import PageTitle from "../components/page-title";
import { ListLayout, ListLayoutHeader, ListLayoutBody } from "../components/list-layout";
import { FormLayout, FormField } from "../components/forms";
import { TextBox, Checkbox, TextArea } from "@progress/kendo-react-inputs";
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from "@progress/kendo-react-buttons";
import { useStore } from "../store";
import { useState, useRef } from "react";
import { saveIcon, clockArrowRotateIcon, trashIcon, plusIcon } from "@progress/kendo-svg-icons";
import countries from "../data/countries";
import contactStages from "../data/contact-stages";
import Stage from "../models/stage";

const stages = Object.keys(contactStages).map(key => Stage.fromValue(contactStages[key])); 

export default function Contacts() {
  const contacts = useStore((state) => state.contacts);
  const getContact = useStore((state) => state.getContact);
  const [currentContact, setCurrentContact] = useState(null);
  const [isDetailsWindowVisible, setIsDetailsWindowVisible] = useState(false);
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [error, setError] = useState("");
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [deleteItemLabel, setDeleteItemLabel] = useState("");
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
      `${currentContact.first_name} ${currentContact.last_name} (ID: ${currentContact.id})`
    );
    toggleDeleteDialog();
  };

  const deleteItem = () => {
    console.log("deleting item");
    toggleDetailsWindow();
    toggleDeleteDialog();
  };

  const handleRowClick = (event) => {
    setCurrentContact(getContact(event.dataItem.id));
    setIsDetailsWindowVisible(true);
  };

  const createContact = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    console.log("create contact", data);
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsLoading(false);
    toggleCreateWindow();
  }

  return (
    <>
      <MainLayout>
        <ListLayout>
          <ListLayoutHeader>
            <PageTitle>Contacts</PageTitle>
          </ListLayoutHeader>
          <ListLayoutBody>
            <Grid 
              data={contacts}
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
                <Button
                  svgIcon={plusIcon}
                  onClick={toggleCreateWindow}
                >
                  New Contact
                </Button>
              </GridToolbar>
              <Column
                field="id"
                title="ID"
                filterable={false}
                width="120px"
              />
              <Column
                field="first_name"
                title="First Name"
                filterable={true}
              />
              <Column
                field="last_name"
                title="Last Name"
                filterable={true}
              />
              <Column
                field="email"
                title="Email"
                filterable={true}
              />
              <Column
                field="country"
                title="Country"
                filterable={true}
              />
              <Column
                field="created"
                title="Registration Date"
                filterable={false}
              />
            </Grid>
          </ListLayoutBody>
        </ListLayout>
      </MainLayout>

      { isCreateWindowVisible ? (
        <Window
          modal={true}
          minimizeButton={() => <></>}
          title="New Contact"
          onClose={toggleCreateWindow}
          initialWidth={680}
          initialHeight={790}
        >
          <form ref={createForm} onSubmit={createContact}>
            <FormLayout>
              <FormField label="First Name" editorId="first_name"> 
                <TextBox
                  required
                  name="first_name"
                  id="first_name"
                />
              </FormField>

              <FormField label="Last Name" editorId="last_name"> 
                <TextBox
                  required
                  name="last_name"
                  id="last_name"
                />
              </FormField>

              <FormField label="Email" editorId="email"> 
                <TextBox
                  required
                  name="email"
                  id="email"
                  type="email"
                />
              </FormField>

              <FormField label="Country" editorId="country"> 
                <DropDownList
                  name="country"
                  id="country"
                  data={countries}
                />
              </FormField>

              <FormField label="Stage" editorId="stage"> 
                <DropDownList
                  name="stage"
                  id="stage"
                  textField="label"
                  dataItemKey="value"
                  data={stages}
                />
              </FormField>

              <FormField label="Do Not Message" editorId="do_not_message"> 
                <Checkbox
                  size="large"
                  name="do_not_message"
                  id="do_not_message"
                />
              </FormField>

              <FormField label="Notes" editorId="notes"> 
                <TextArea
                  name="notes"
                  id="notes"
                  autoSize={true}
                  resizable="vertical"
                  rows={5}
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
              { isLoading ? "Creating Contact" : "Create Contact" }
            </Button>
          </WindowActionsBar>
        </Window>
      ) : null }

      { isDetailsWindowVisible ? (
        <Window
          modal={true}
          minimizeButton={() => <></>}
          title="Contact Details"
          onClose={toggleDetailsWindow}
          initialWidth={680}
          initialHeight={890}
        >
          <form ref={detailsForm} onSubmit={saveChanges}>
            <FormLayout>
              <FormField label="ID" editorId="id"> 
                <TextBox
                  required
                  readOnly
                  name="id"
                  id="id"
                  value={currentContact.id}
                />
              </FormField>

              <FormField label="First Name" editorId="first_name"> 
                <TextBox
                  required
                  name="first_name"
                  id="first_name"
                  defaultValue={currentContact.first_name}
                />
              </FormField>

              <FormField label="Last Name" editorId="last_name"> 
                <TextBox
                  required
                  name="last_name"
                  id="last_name"
                  defaultValue={currentContact.last_name}
                />
              </FormField>

              <FormField label="Email" editorId="email"> 
                <TextBox
                  required
                  name="email"
                  id="email"
                  defaultValue={currentContact.email}
                />
              </FormField>

              <FormField label="Country" editorId="country"> 
                <DropDownList
                  name="country"
                  id="country"
                  data={countries}
                  defaultValue={currentContact.country}
                />
              </FormField>

              <FormField label="Stage" editorId="stage"> 
                <DropDownList
                  name="stage"
                  id="stage"
                  textField="label"
                  dataItemKey="value"
                  data={stages}
                  defaultValue={Stage.fromValue(currentContact.stage)}
                />
              </FormField>

              <FormField label="Registration Date" editorId="created"> 
                <DatePicker
                  name="created"
                  id="created"
                  defaultValue={new Date(currentContact.created)}
                />
              </FormField>

              <FormField label="Last Activity Date" editorId="last_activity_date"> 
                <DatePicker
                  name="last_activity_date"
                  id="last_activity_date"
                  defaultValue={currentContact.last_activity_date}
                />
              </FormField>

              <FormField label="Do Not Message" editorId="created"> 
                <Checkbox
                  defaultChecked={currentContact.do_not_message}
                  size="large"
                  name="do_not_message"
                  id="do_not_message"
                />
              </FormField>

              <FormField label="Notes" editorId="notes"> 
                <TextArea
                  name="notes"
                  id="notes"
                  autoSize={true}
                  resizable="vertical"
                  rows={5}
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
              Delete Contact
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
