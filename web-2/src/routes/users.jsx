import { useState, useEffect } from "react";
import { Paper, Title } from "@mantine/core";
import { IconChevronUp, IconSelector } from '@tabler/icons-react';
import { DataTable, useDataTableColumns } from "mantine-datatable";

const PAGE_SIZE = 20;

function sortBy(array, iteratee) {
  return [...array].sort((a, b) => {
    const valA = a[iteratee];
    const valB = b[iteratee];
    if (valA > valB) return 1;
    if (valA < valB) return -1;
    return 0;
  });
}

const initialRecords = [
  { id: 1, name: "Joe Biden", email: "joe.biden@outlook.com", country: "USA", created: "31-01-1997" },
  { id: 2, name: "Joe Biden", email: "joe.biden@outlook.com", country: "USA", created: "31-01-1997" },
  { id: 3, name: "Joe Biden", email: "joe.biden@outlook.com", country: "USA", created: "31-01-1997" },
];

export default function Customers() {
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "id",
    direction: "desc",
  });

  const [records, setRecords] = useState(sortBy(initialRecords.slice(0, PAGE_SIZE), "id"));
  const key = "usersDataTable";

  const commonColProps = {
    sortable: true,
    draggable: true,
    resizable: true,
  };

  const { effectiveColumns } = useDataTableColumns({
    key,
    columns: [
      { accessor: "id", title: "#", ...commonColProps },
      { accessor: "name", ...commonColProps },
      { accessor: "email", ...commonColProps },
      { accessor: "country", ...commonColProps },
      { accessor: "created", title: "Registration Date", ...commonColProps },
    ],
  });

  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setRecords(
      sortStatus.direction === "desc"
      ? data.reverse().slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
      : data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    );
  }, [sortStatus, page]);

  return (
    <>
      <Title order={1} mb="lg">Users</Title>
      <Paper shadow="xs">
        <DataTable
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          records={records}
          columns={effectiveColumns}
          storeColumnsKey={key}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          sortIcons={{
            sorted: <IconChevronUp size={14} />,
            unsorted: <IconSelector size={14} />,
          }}
          totalRecords={initialRecords.length}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p) => setPage(p)}
        />
      </Paper>
    </>
  );
}
