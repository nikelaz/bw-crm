import { Paper, Text, Title, Grid, Table } from "@mantine/core";

const newestUsers = [
  {
    id: 1,
    name: "John Doe",
    date: "12/03/2025",
  },
  {
    id: 2,
    name: "Jenny Doe",
    date: "12/03/2025",
  },
  {
    id: 3,
    name: "Brooke Jills",
    date: "12/03/2025",
  },
  {
    id: 4,
    name: "Anthony Folger",
    date: "12/03/2025",
  },
  {
    id: 5,
    name: "Ivan Georgiev",
    date: "12/03/2025",
  }
];

const popularCountries = [
  {
    country: "USA",
    users: 20,
  },
  {
    country: "Bulgaria",
    users: 10,
  },
  {
    country: "India",
    users: 8,
  },
  {
    country: "Germany",
    users: 7,
  },
  {
    country: "Russia",
    users: 3,
  },
];

export default function Dashboard() {
  return (
    <>
      <Title order={1} mb="lg">Dashboard</Title>
      <Grid>
        <Grid.Col span={4}>
          <Paper shadow="xs" p="lg">
            <Title order={1} c="blue" mb="xs">106</Title>
            <Text>Users</Text> 
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper shadow="xs" p="lg">
            <Title order={1} c="blue" mb="xs">8</Title>
            <Text>New Users This Month</Text> 
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper shadow="xs" p="lg">
            <Title order={1} c="blue" mb="xs">17</Title>
            <Text>Active Users</Text> 
          </Paper>
        </Grid.Col>
        <Grid.Col span={8}>
          <Paper shadow="xs" p="lg">
            <Title order={5} mb="sm">5 Newest Users</Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Registration Date</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {newestUsers.map(user => (
                  <Table.Tr>
                    <Table.Td>{user.id}</Table.Td>
                    <Table.Td>{user.name}</Table.Td>
                    <Table.Td>{user.date}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper shadow="xs" p="lg">
            <Title order={5} mb="sm">Most Popular Countries</Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Country</Table.Th>
                  <Table.Th>Users</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {popularCountries.map(node => (
                  <Table.Tr>
                    <Table.Td>{node.country}</Table.Td>
                    <Table.Td>{node.users}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
}
