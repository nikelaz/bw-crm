import MainLayout from "../components/main-layout";
import { Grid, GridColumn as Column, GridToolbar, GridSearchBox } from "@progress/kendo-react-grid";
import { Window, WindowActionsBar, Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { StackLayout } from "@progress/kendo-react-layout";
import PageTitle from "../components/page-title";
import { ListLayout, ListLayoutHeader, ListLayoutBody } from "../components/list-layout";
import { FormLayout, FormField } from "../components/forms";
import { TextBox } from "@progress/kendo-react-inputs";
import { ListBox, ListBoxToolbar, processListBoxData, processListBoxDragAndDrop } from "@progress/kendo-react-listbox";
import { Button } from "@progress/kendo-react-buttons";
import { useStore } from "../store";
import { useState, useRef } from "react";
import { saveIcon, clockArrowRotateIcon, trashIcon, plusIcon } from "@progress/kendo-svg-icons";

const SELECTED_FIELD = "selected";

export default function Lists() {
  const contacts = useStore((state) => state.contacts);
  const formattedContacts = contacts.map(contact => ({
    ...contact,
    formattedName: `${contact.first_name} ${contact.last_name} <${contact.email}>`,
    selected: false,
  }));
  const [listState, setListState] = useState({
    allContacts: formattedContacts,
    selectedContacts: [],
    draggedItem: {}
  });
  const lists = useStore((state) => state.lists);
  const getList = useStore((state) => state.getList);
  const [currentList, setCurrentList] = useState(null);
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
      `${currentList.title} (ID: ${currentList.id})`
    );
    toggleDeleteDialog();
  };

  const deleteItem = () => {
    console.log("deleting item");
    toggleDetailsWindow();
    toggleDeleteDialog();
  };

  const handleRowClick = (event) => {
    setCurrentList(getList(event.dataItem.id));
    setIsDetailsWindowVisible(true);
  };

  const createList = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.selectedContacts = listState.selectedContacts;
    console.log("create list", data);
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsLoading(false);
    toggleCreateWindow();
  }

  const handleListItemClick = (event, data, connectedData) => {
        setListState({
            ...listState,
            [data]: listState[data].map((item) => {
                if (item.id === event.dataItem.id) {
                    item[SELECTED_FIELD] = !item[SELECTED_FIELD];
                } else if (!event.nativeEvent.ctrlKey) {
                    item[SELECTED_FIELD] = false;
                }
                return item;
            }),
            [connectedData]: listState[connectedData].map((item) => {
                item[SELECTED_FIELD] = false;
                return item;
            })
        });
    };

  const handleToolBarClick = (event) => {
    const toolName = event.toolName || '';
    const result = processListBoxData(listState.allContacts, listState.selectedContacts, toolName, SELECTED_FIELD);
    setListState({
      ...listState,
      allContacts: result.listBoxOneData,
      selectedContacts: result.listBoxTwoData
    });
  };

  const handleDragStart = (event) => {
    setListState({
      ...listState,
      draggedItem: event.dataItem
    });
  };

  const handleDrop = (event) => {
    let result = processListBoxDragAndDrop(
      listState.allContacts,
      listState.selectedContacts,
      listState.draggedItem,
      event.dataItem,
      "id"
    );
    setListState({
      ...listState,
      allContacts: result.listBoxOneData,
      selectedContacts: result.listBoxTwoData
    });
  };

  return (
    <>
      <MainLayout>
        <ListLayout>
          <ListLayoutHeader>
            <PageTitle>Lists</PageTitle>
          </ListLayoutHeader>
          <ListLayoutBody>
            <Grid 
              data={lists}
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
                  New List
                </Button>
              </GridToolbar>
              <Column
                field="id"
                title="ID"
                filterable={false}
                width="120px"
              />
              <Column
                field="title"
                title="Title"
                filterable={true}
              />
            </Grid>
          </ListLayoutBody>
        </ListLayout>
      </MainLayout>

      { isCreateWindowVisible ? (
        <Window
          modal={true}
          minimizeButton={() => <></>}
          title="New List"
          onClose={toggleCreateWindow}
          initialWidth={960}
          initialHeight={700}
        >
          <form ref={createForm} onSubmit={createList}>
            <FormLayout>
              <FormField label="Title" editorId="title"> 
                <TextBox
                  required
                  name="title"
                  id="title"
                />
              </FormField>

              <StackLayout orientation="horizontal" gap="0.5rem">
                <FormField label="All Customers" editorId="all-customers"> 
                  <ListBox
                    id="all-customers"
                    style={{ height: 400, width: '100%' }}
                    data={listState.allContacts}
                    textField="formattedName"
                    selectedField={SELECTED_FIELD}
                    onItemClick={(event) => handleListItemClick(event, "allContacts", "selectedContacts")}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    toolbar={() => {
                      return (
                        <ListBoxToolbar
                          tools={[
                            'transferTo',
                            'transferFrom',
                            'transferAllTo',
                            'transferAllFrom',
                          ]}
                          data={listState.allContacts}
                          dataConnected={listState.selectedContacts}
                          onToolClick={handleToolBarClick}
                        />
                      );
                    }}
                  />
                </FormField>

                <FormField label="Included in the List" editorId="included-customers"> 
                  <ListBox
                    id="included-customers"
                    style={{ height: 400, width: '100%' }}
                    data={listState.selectedContacts}
                    textField="formattedName"
                    selectedField={SELECTED_FIELD}
                    onItemClick={(event) => handleListItemClick(event, "selectedContacts", "allContacts")}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                  />
                </FormField>
              </StackLayout>
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
              { isLoading ? "Creating List" : "Create List" }
            </Button>
          </WindowActionsBar>
        </Window>
      ) : null }

      { isDetailsWindowVisible ? (
        <Window
          modal={true}
          minimizeButton={() => <></>}
          title="List Details"
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
                  value={currentList.id}
                />
              </FormField>

              <FormField label="Title" editorId="title"> 
                <TextBox
                  required
                  name="title"
                  id="title"
                  defaultValue={currentList.title}
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
              Delete List
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
