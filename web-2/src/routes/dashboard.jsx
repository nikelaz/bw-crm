import PageTitle from "../components/page-title";
import MainLayout from "../components/main-layout";
import { ListLayout, ListLayoutHeader } from "../components/list-layout";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
  StackLayout
} from "@progress/kendo-react-layout";
import { useStore } from "../store.js";

const styles = {
  stat: {
    fontSize: "1.75rem",
  }
};

function formatNewestContacts(contacts) {
  return contacts.map(contact => ({
    ...contact,
    name: `${contact.first_name} ${contact.last_name}`
  }));
}

export default function Dashboard() {
  const getNewestContacts = useStore(store => store.getNewestContacts);
  const getPopularCountries = useStore(store => store.getPopularCountries);

  const newestContacts = getNewestContacts();
  const formattedNewestContacts = formatNewestContacts(newestContacts);
  const popularCountries = getPopularCountries();

  return (
    <MainLayout>
      <ListLayout>
        <ListLayoutHeader>
          <PageTitle>Dashboard</PageTitle>
        </ListLayoutHeader>
        <StackLayout orientation="horizontal" gap={20}>
          <Card>
            <CardBody>
              <CardTitle style={styles.stat}>106</CardTitle>
              <CardSubtitle>Contacts</CardSubtitle>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <CardTitle style={styles.stat}>5</CardTitle>
              <CardSubtitle>New Contacts This Month</CardSubtitle>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <CardTitle style={styles.stat}>23</CardTitle>
              <CardSubtitle>Active Contacts</CardSubtitle>
            </CardBody>
          </Card>
        </StackLayout>
        <StackLayout orientation="horizontal" gap={20}>
          <Card style={{minWidth: "60%"}}>
            <CardHeader>
              <CardTitle>Newest Contacts</CardTitle>
            </CardHeader>
            <CardBody>
              <Grid 
                data={formattedNewestContacts}
                dataItemKey="id"
                resizable={true}
              >
                <Column
                  field="id"
                  title="ID"
                  width="75px"
                />
                <Column
                  field="name"
                  title="Name"
                />
                <Column
                  field="email"
                  title="Email"
                />
                <Column
                  field="created"
                  title="Registration Date"
                />
              </Grid>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Countries</CardTitle>
            </CardHeader>
            <CardBody>
              <Grid 
                data={popularCountries}
                dataItemKey="id"
                resizable={true}
              >
                <Column
                  field="country"
                  title="Country"
                />
                <Column
                  field="count"
                  title="Contacts (Count)"
                />
              </Grid>
            </CardBody>
          </Card>
        </StackLayout>
      </ListLayout>
    </MainLayout>
  );
}
