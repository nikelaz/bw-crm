import PageTitle from "../components/page-title";
import MainLayout from "../components/main-layout";
import { ListLayout, ListLayoutHeader } from "../components/list-layout";
import { useState } from "react";
import { useStore } from "../store";
import {
  ListBox,
  processListBoxData,
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

export default function LeadsBoard() {
  const contacts = useStore(state => state.contacts);
 
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
    let target = e.target;
    e.dataItem.dataCollection = target.props.id || '';
    setState({
      ...state,
      draggedItem: e.dataItem
    });
  };

  const handleDrop = e => {
    let target = e.target;
    let dragItemData = state.draggedItem.dataCollection;
    console.log('drag', dragItemData);
    let dropItemData = target.props.id;
    console.log('dropItemData', dropItemData);
    let result = processListBoxDragAndDrop(state[dragItemData], state[dropItemData], state.draggedItem, e.dataItem, 'id');
    setState({
      ...state,
      [dragItemData]: result.listBoxOneData,
      [dropItemData]: result.listBoxTwoData
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
            stage={stages.NEW}
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
