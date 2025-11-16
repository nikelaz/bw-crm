import MainLayout from "./main-layout";
import PageTitle from "./page-title";
import { ListLayout, ListLayoutHeader, ListLayoutBody } from "./list-layout";
import { StackLayout } from "@progress/kendo-react-layout";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import { useLocation } from "wouter";

export default function EmailsLayout(props) {
  const [route, navigate] = useLocation();

  return (
    <MainLayout>
      <ListLayout>
        <ListLayoutHeader>
          <StackLayout orientation="horizontal" align={{vertical: "middle"}} gap={20}>
            <PageTitle>Emails</PageTitle>
            <ButtonGroup>
              <Button
                onClick={() => navigate("/emails")}
                togglable={true}
                selected={route === "/emails"}
              >
                Sent Emails
              </Button>
              <Button
                onClick={() => navigate("/emails/templates")}
                togglable={true}
                selected={route === "/emails/templates"}
              >
                Email Templates
              </Button>
              <Button
                onClick={() => navigate("/emails/send")}
                togglable={true}
                selected={route === "/emails/send"}
              >
                Send Emails to Contacts
              </Button>
            </ButtonGroup>
          </StackLayout>
        </ListLayoutHeader>
        <ListLayoutBody>
          {props.children}
        </ListLayoutBody>
      </ListLayout>
    </MainLayout>
  );
}
