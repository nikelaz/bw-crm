import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { ListLayout, ListLayoutHeader, ListLayoutBody } from "../components/list-layout";
import MainLayout from "../components/main-layout";
import PageTitle from "../components/page-title";
import { useStore } from "../store";

const formatEmails = (emails) => {
  return emails.map(email => ({
    ...email,
    from: `${email.from_name} <${email.from_email}>`,
    to: `${email.to_name} <${email.to_email}>`,
  }));
};

export default function Emails() {
  const emails = useStore((state) => state.emails);
  const formattedEmails = formatEmails(emails);

  return (
    <MainLayout>
      <ListLayout>
        <ListLayoutHeader>
          <PageTitle>Emails</PageTitle>
        </ListLayoutHeader>
        <ListLayoutBody>
          <Grid 
            data={formattedEmails}
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
          >
            <Column
              field="id"
              title="ID"
              filterable={false}
              width="120px"
            />
            <Column
              field="date"
              title="Date"
              filterable={false}
            />
            <Column
              field="from"
              title="From"
              filterable={true}
            /> 
            <Column
              field="to"
              title="To"
              filterable={true}
            />
          </Grid>
        </ListLayoutBody>
      </ListLayout>
    </MainLayout>
  );
}
