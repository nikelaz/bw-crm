import MainLayout from "../components/main-layout";
import { Grid, GridColumn as Column, GridToolbar, GridSearchBox } from "@progress/kendo-react-grid";
import { Window, Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { StackLayout } from "@progress/kendo-react-layout";
import PageTitle from "../components/page-title";
import { ListLayout, ListLayoutHeader, ListLayoutBody } from "../components/list-layout";
import { FormLayout, FormField } from "../components/forms";
import { TextBox, Switch, TextArea } from "@progress/kendo-react-inputs";
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from "@progress/kendo-react-buttons";
import { useStore } from "../store";
import { useState } from "react";
import { saveIcon, clockArrowRotateIcon, trashIcon } from "@progress/kendo-svg-icons";
import countries from "../data/countries";

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
              <Column
                title="Actions"
                filterable={false}
              />
            </Grid>
          </ListLayoutBody>
        </ListLayout>
      </MainLayout>
      { isDetailsWindowVisible ? (
        <Window
          modal={true}
          minimizeButton={() => <></>}
          title="Contact Details"
          onClose={toggleDetailsWindow}
          initialWidth={680}
          initialHeight={890}
        >
          <form onSubmit={saveChanges}>
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
                <Switch
                  defaultChecked={false}
                  size="large"
                  name="do-not-message"
                  id="do-not-message"
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
             
              <StackLayout style={{ width: "fit-content" }} orientation="horizontal" gap={20}>
                <Button
                  svgIcon={isLoading ? clockArrowRotateIcon : saveIcon}
                  disabled={isLoading}
                  themeColor="primary"
                  type="submit"
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
              </StackLayout>
            </FormLayout>
          </form>
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
