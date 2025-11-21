import PageTitle from "../components/page-title";
import MainLayout from "../components/main-layout";
import { ListLayout, ListLayoutHeader } from "../components/list-layout";
import { useState, useEffect } from "react";
import { useStore } from "../store";
import {
  ListBox,
  processListBoxDragAndDrop
} from "@progress/kendo-react-listbox";
import {
  StackLayout,
} from "@progress/kendo-react-layout";
import stages from "../data/contact-stages";

const SELECTED_FIELD = 'selected';

const transformContact = (contact) => ({
  ...contact,
  selected: false,
}); 

const ListBoxItem = (props) => {
  let { dataItem, selected, ...others } = props;
  return (
    <li {...others}>
      <div>
        <div>{dataItem.first_name} {dataItem.last_name}</div>
        <div>{dataItem.email}</div>
        <div>Company Name</div>
      </div>
    </li>
  );
};

export default function LeadsBoard() {
  const contacts = useStore(state => state.contacts);
  const updateContact = useStore(state => state.updateContact);

  const newLeads = [];
  const contacted = [];
  const qualified = [];
  const disqualified = [];

  contacts.forEach(contact => {
    switch (contact.stage) {
      case stages.NEW:
        newLeads.push(transformContact(contact));
        break;
      case stages.CONTACTED:
        contacted.push(transformContact(contact));
        break;
      case stages.QUALIFIED:
        qualified.push(transformContact(contact));
        break;
      case stages.DISQUALIFIED:
        disqualified.push(transformContact(contact));
    }
  });
   
  const [state, setState] = useState({
    newLeads,
    contacted,
    qualified,
    disqualified,
    draggedItem: {}
  });

  const handleItemClick = (event, data, connectedData, secondConnectedData, thirdConnectedData) => {
    setState({
      ...state,
      [data]: state[data].map(item => {
        if (item.id === event.dataItem.id) {
          console.log("selected", item);
          item[SELECTED_FIELD] = !item[SELECTED_FIELD];
        } else if (!event.nativeEvent.ctrlKey) {
          item[SELECTED_FIELD] = false;
        }
        return item;
      }),
      [connectedData]: state[connectedData].map(item => {
        item[SELECTED_FIELD] = false;
        return item;
      }),
      [secondConnectedData]: state[secondConnectedData].map(item => {
        item[SELECTED_FIELD] = false;
        return item;
      }),
      [thirdConnectedData]: state[thirdConnectedData].map(item => {
        item[SELECTED_FIELD] = false;
        return item;
      })
    });
  };

  const handleDragStart = e => {
    setState({
      ...state,
      draggedItem: e.dataItem
    });
  };

  const handleDrop = e => {
    let target = e.target;
    let dragItemData = state.draggedItem;
    let dragItemStage = dragItemData.stage;
    if (dragItemData.stage === stages.NEW) {
      dragItemStage = "newLeads";
    }

    let dropItemStage = target.props.name;
    dragItemData.stage = dropItemStage === "newLeads" ? stages.NEW : dropItemStage; 
    let result = processListBoxDragAndDrop(state[dragItemStage], state[dropItemStage], state.draggedItem, e.dataItem, 'id');

    setState({
      ...state,
      [dragItemStage]: result.listBoxOneData,
      [dropItemStage]: result.listBoxTwoData
    });

    updateContact(dragItemData.id, {
      stage: dropItemStage === "newLeads" ? stages.NEW : dropItemStage
    });
  };

  return (
    <MainLayout>
      <ListLayout>
        <ListLayoutHeader>
          <PageTitle>Leads Board</PageTitle>
        </ListLayoutHeader>
        
        <StackLayout orientation="horizontal" gap="0.5rem"> 
          <Stage
            title="New Leads"
            data={state.newLeads}
            stage="newLeads"
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
            handleItemClick={e => handleItemClick(
              e, "newLeads", stages.CONTACTED, stages.QUALIFIED, stages.DISQUALIFIED
            )}
          /> 
          <Stage
            title="Contacted"
            data={state.contacted}
            stage={stages.CONTACTED}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
            handleItemClick={e => handleItemClick(
              e, stages.CONTACTED, "newLeads", stages.QUALIFIED, stages.DISQUALIFIED
            )}
          />
          <Stage
            title="Qualified"
            data={state.qualified}
            stage={stages.QUALIFIED}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
            handleItemClick={e => handleItemClick(
              e, stages.QUALIFIED, "newLeads", stages.CONTACTED, stages.DISQUALIFIED
            )}
          />
          <Stage
            title="Disqualified"
            data={state.disqualified}
            stage={stages.DISQUALIFIED}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
            handleItemClick={e => handleItemClick(
              e, stages.DISQUALIFIED, "newLeads", stages.CONTACTED, stages.QUALIFIED
            )}
          />
        </StackLayout>
      </ListLayout>
    </MainLayout>
  );
}

const Stage = (props) => {
  return (
    <div>
      <p>{props.title}</p>
      <ListBox
        style={{
          height: '100%',
          width: '100%'
        }}
        item={ListBoxItem}
        data={props.data}
        textField="email"
        selectedField={SELECTED_FIELD}
        onItemClick={props.handleItemClick}
        onDragStart={props.handleDragStart}
        onDrop={props.handleDrop}
        name={props.stage}
      />
    </div>
  )
};
