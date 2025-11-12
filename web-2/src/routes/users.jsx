import { Paper, Title } from "@mantine/core";
import { DataTable } from "mantine-datatable";

export default function Customers() {
  return (
    <>
      <Title order={1} mb="lg">Users</Title>
      <Paper shadow="xs">
        <DataTable
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          records={[
            { id: 1, name: 'Joe Biden', email: "joe.biden@outlook.com", country: "USA", created: "31-01-1997" },
          ]}
          columns={[
            {
              accessor: 'id',
              title: '#',
              sortable: true,
              draggable: true,
              resizable: true,
            },
            { accessor: 'name', sortable: true, draggable: true, resizable: true, },
            { accessor: 'email', sortable: true, draggable: true, resizable: true, },
            { accessor: 'country', sortable: true, draggable: true, resizable: true, },
            {
              accessor: 'created',
              title: "Registration Date",
              sortable: true,
              draggable: true,
              resizable: true,
            },
          ]}
        />
      </Paper>
    </>
  );
}
