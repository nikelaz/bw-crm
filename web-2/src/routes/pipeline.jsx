import PageTitle from "../components/page-title";
import MainLayout from "../components/main-layout";
import { ListLayout, ListLayoutHeader } from "../components/list-layout";
import { useState } from "react";
import {
  ListBox,
  ListBoxToolbar,
  processListBoxData,
  processListBoxDragAndDrop
} from "@progress/kendo-react-listbox";
import {
  StackLayout,
} from "@progress/kendo-react-layout";

const toDo = [
    { name: 'SpreadSheet', selected: false },
    { name: 'PivotGrid', selected: false }
];

const inDevelopment = [
    { name: 'TileLayout', selected: false },
    { name: 'MultiColumnComboBox', selected: false }
];

const shipped = [
    { name: 'Grid', selected: false },
    { name: 'Scheduler', selected: false }
];

const SELECTED_FIELD = 'selected';
const toolbarTools = ['moveUp', 'moveDown', 'transferTo', 'transferFrom', 'transferAllTo', 'transferAllFrom', 'remove'];

export default function Pipeline() {
  const [state, setState] = useState({
    toDo,
    inDevelopment,
    shipped,
    draggedItem: {}
  });

  const handleItemClick = (event, data, connectedData, secondConnectedData) => {
    setState({
      ...state,
      [data]: state[data].map(item => {
        if (item.name === event.dataItem.name) {
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
      })
    });
  };

  const handleToolBarClick = (e, data, connectedData) => {
    let result = processListBoxData(state[data], state[connectedData], e.toolName, SELECTED_FIELD);
    setState({
      ...state,
      [data]: result.listBoxOneData,
      [connectedData]: result.listBoxTwoData
    });
  };

  const handleDragStart = e => {
    let target = e.target;
    e.dataItem.dataCollection = target.props.name || '';
    setState({
      ...state,
      draggedItem: e.dataItem
    });
  };

  const handleDrop = e => {
    let target = e.target;
    let dragItemData = state.draggedItem.dataCollection;
    let dropItemData = target.props.name;
    let result = processListBoxDragAndDrop(state[dragItemData], state[dropItemData], state.draggedItem, e.dataItem, 'name');
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
          <PageTitle>Sales Pipeline</PageTitle>
        </ListLayoutHeader>
        
        <StackLayout orientation="horizontal" gap="0.5rem"> 
          <div>
            <p>Lead</p>
            <ListBox style={{
              height: 350,
              width: '100%'
            }} data={state.toDo} textField="name" selectedField={SELECTED_FIELD} onItemClick={e => handleItemClick(e, 'toDo', 'inDevelopment', 'shipped')} onDragStart={handleDragStart} onDrop={handleDrop}
              // @ts-ignore: for specific use
              name='toDo'  />
          </div>
          <div>
            <p>Contacted</p>
            <ListBox style={{
              height: 350,
              width: '100%'
            }} data={state.inDevelopment} textField="name" selectedField={SELECTED_FIELD} onItemClick={e => handleItemClick(e, 'inDevelopment', 'toDo', 'shipped')} onDragStart={handleDragStart} onDrop={handleDrop}
              // @ts-ignore: for specific use
              name='inDevelopment'  />
          </div>
          <div>
            <p>Qualified</p>
            <ListBox style={{
              height: 350,
              width: '100%'
            }} data={state.shipped} textField="name" selectedField={SELECTED_FIELD} onItemClick={e => handleItemClick(e, 'shipped', 'inDevelopment', 'toDo')} onDragStart={handleDragStart} onDrop={handleDrop}
              // @ts-ignore: for specific use
              name='shipped' />
          </div>
        </StackLayout>
      </ListLayout>
    </MainLayout>
  );
}
