import React from 'react';
import { Button } from 'react-native';
import { Container } from './styles';
import { useAuth } from '../../hooks/Auth';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Container>
      <Button title="Sign Out" onPress={() => signOut()} />
    </Container>
  );
};

export default Dashboard;
