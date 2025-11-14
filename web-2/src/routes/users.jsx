import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { StackLayout } from "@progress/kendo-react-layout";
import PageTitle from "../components/page-title";
import { useStore } from "../store";

export default function Users() {
  const users = useStore((state) => state.users);

  return (
    <StackLayout orientation="vertical" gap={20}>
      <PageTitle>Users</PageTitle>
      <Grid 
        data={users}
        dataItemKey="id"
        autoProcessData={true}
        sortable={true}
        filterable={true}
        editable={{
          mode: "incell"
        }}
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
          field="name"
          title="Name"
          editable={false}
          filterable={true}
        />
        <Column
          field="email"
          title="Email"
          editable={false}
          filterable={true}
        />
        <Column
          field="country"
          title="Country"
          editable={false}
          filterable={true}
        />
        <Column
          field="created"
          title="Registration Date"
          editable={false}
          filterable={true}
        />
      </Grid>
    </StackLayout>
  );
}
