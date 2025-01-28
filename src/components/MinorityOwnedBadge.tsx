import styled from 'styled-components';

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: #ff9800;
  color: white;
  border-radius: 12px;
  padding: 8px 12px;
  font-weight: bold;
`;

const MinorityOwnedBadge = () => (
  <Badge>Minority-Owned</Badge>
);

export default MinorityOwnedBadge;
