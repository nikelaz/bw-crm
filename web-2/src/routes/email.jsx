import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { StackLayout } from "@progress/kendo-react-layout";
import PageTitle from "../components/page-title";
import { useStore } from "../store";

const FromCell = (props) => {
  const { dataItem } = props;

  return (
    <td>
      {dataItem.from_email}
    </td>
  );
};

export default function Emails() {
  const emails = useStore((state) => state.emails);

  return (
    <StackLayout orientation="vertical" gap={20}>
      <PageTitle>Emails</PageTitle>
      <Grid 
        data={emails}
        dataItemKey="id"
        autoProcessData={true}
        sortable={true}
        filterable={true}
        editable={{
          mode: "incell"
        }}
        reorderable={true}
        defaultTake={15}
        pageable={{
          buttonCount: 4,
          pageSizes: [5, 10, 15, 20, 50]
        }}
      >
        <Column
          field="id"
          title="ID"
          editable={false}
          filterable={false}
          width="75px"
        />
        <Column
          field="date"
          title="Date"
          editable={false}
          filterable={false}
        />
        <Column
          field="from_name"
          title="From"
          cell={FromCell}
          editable={false}
          filterable={true}
        />
      </Grid>
    </StackLayout>
  );
}
